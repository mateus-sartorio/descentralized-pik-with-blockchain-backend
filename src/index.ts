import createClient from "openapi-fetch";
import { components, paths } from "./schema";
import forge from 'node-forge';
const crypto = require('crypto');

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<void>;
type AdvanceRequestHandler = (data: AdvanceRequestData) => Promise<RequestHandlerResult>;

interface Certificate {
  isValid: boolean,
  serialNumber: string,
  rawCertificate: string
}

const certificates: Certificate[] = [];

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

function hexToString(hex: string): string {
  if (hex.startsWith("0x")) {
    hex = hex.slice(2);
  }

  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  let result = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    result += String.fromCharCode(charCode);
  }

  return result;
}

function stringToHex(str: string): string {
  const hex = Array.from(str).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  return `0x${hex}`;
}

function replaceCRLFWithLineBreaks(input: string): string {
  return input.replace(/\\r\\n/g, '\n');
}

function isCertificateValid(certPem: string): boolean {
  try {
    const certDer = Buffer.from(certPem.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, ''), 'base64');
    const cert = new crypto.X509Certificate(certDer);
    const publicKey = cert.publicKey;

    return cert.verify(publicKey);
  }
  catch (e) {
    return false;
  }
}

function extractSerialNumber(pemCert: string): string {
  const cert = forge.pki.certificateFromPem(pemCert);
  const serialNumber = cert.serialNumber;
  return serialNumber;
}

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));

  const payload = hexToString(data.payload);
  console.log(payload);

  const filteredPayload = replaceCRLFWithLineBreaks(payload);
  console.log(filteredPayload);

  const certPem = filteredPayload;

  const isValid = isCertificateValid(certPem);

  console.log('Certificate matches its public key:', isValid);

  if (isValid) {
    const serialNumber = extractSerialNumber(filteredPayload);

    certificates.push({
      isValid: true,
      serialNumber,
      rawCertificate: filteredPayload
    });

    console.log(certificates);

    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: stringToHex(JSON.stringify(certificates)) }),
    });
    
    return "accept";
  }

  await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: stringToHex(JSON.stringify(filteredPayload)) }),
  });

  return "reject";
};

const handleInspect: InspectRequestHandler = async (data) => {
  console.log("Received inspect request data " + JSON.stringify(data));

  const validCertificates = certificates.filter(c => c.isValid).map(c => c.rawCertificate);

  console.log(validCertificates);

  await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: stringToHex(JSON.stringify(validCertificates)) }),
  });
};

const main = async () => {
  const { POST } = createClient<paths>({ baseUrl: rollupServer });
  
  let status: RequestHandlerResult = "accept";
  while (true) {
    const { response } = await POST("/finish", {
      body: { status },
      parseAs: "text",
    });

    if (response.status === 200) {
      const data = (await response.json()) as RollupsRequest;

      switch (data.request_type) {
        case "advance_state":
          status = await handleAdvance(data.data as AdvanceRequestData);
          break;

        case "inspect_state":
          await handleInspect(data.data as InspectRequestData);
          break;
      }
    }
    else if (response.status === 202) {
      console.log(await response.text());
    }
  }
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});