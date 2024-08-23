import createClient from "openapi-fetch";
import { components, paths } from "./schema";
import { hexToString, replaceCRLFWithLineBreaks, stringToHex } from "./utils";
import { Certificate, extractSerialNumber, isCertificateValid } from "./certificate";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<void>;
type AdvanceRequestHandler = (data: AdvanceRequestData) => Promise<RequestHandlerResult>;

let certificates: Certificate[] = [];

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  const rawInput = hexToString(data.payload);
  console.log("Received advance request data: ", rawInput);

  const { action, payload } = JSON.parse(rawInput);

  if (action === "create") {
    const certPem = replaceCRLFWithLineBreaks(payload);

    const isValid = isCertificateValid(certPem);

    console.log('Certificate matches its public key:', isValid);

    if (isValid) {
      const serialNumber = extractSerialNumber(certPem);

      certificates.push({
        isValid: true,
        serialNumber,
        rawCertificate: certPem
      });

      console.log("Certificates: ", certificates);

      await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: stringToHex(JSON.stringify(certificates)) }),
      });

      return "accept";
    }
  }
  else if (action === "invalidate") {
    certificates = certificates.map(c => {
      if (c.serialNumber.toLowerCase() === payload.toLowerCase()) {
        return {
          ...c,
          isValid: false
        }
      }

      return c;
    });

    console.log("Certificates: ", certificates);

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
    body: JSON.stringify({ payload: stringToHex(JSON.stringify(rawInput)) }),
  });

  return "reject";
};

const handleInspect: InspectRequestHandler = async (data) => {
  console.log("Received inspect request data " + JSON.stringify(data));

  const validCertificates = certificates.filter(c => c.isValid).map(c => c.rawCertificate);

  console.log("Certificates: ", certificates);

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