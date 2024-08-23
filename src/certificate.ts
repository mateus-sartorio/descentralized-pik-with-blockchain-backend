import forge from 'node-forge';
const crypto = require('crypto');

export interface Certificate {
  isValid: boolean,
  serialNumber: string,
  rawCertificate: string
}

export function isCertificateValid(certPem: string): boolean {
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

export function extractSerialNumber(pemCert: string): string {
  const cert = forge.pki.certificateFromPem(pemCert);
  const serialNumber = cert.serialNumber;
  return serialNumber;
}