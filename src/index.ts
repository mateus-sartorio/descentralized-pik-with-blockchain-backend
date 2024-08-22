import createClient from "openapi-fetch";
import { components, paths } from "./schema";
const crypto = require('crypto');

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<void>;
type AdvanceRequestHandler = (
  data: AdvanceRequestData
) => Promise<RequestHandlerResult>;

const certificates = [];

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
  catch(e) {
    return false;
  }
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

  if(isValid) {
    certificates.push(filteredPayload);
  }

  return "accept";
};

const handleInspect: InspectRequestHandler = async (data) => {
  console.log("Received inspect request data " + JSON.stringify(data));
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
    } else if (response.status === 202) {
      console.log(await response.text());
    }
  }
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
