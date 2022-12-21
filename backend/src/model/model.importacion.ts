export interface Importacion {

  nroAutorizacion: number;
  isMicam: boolean;
  isInternado: boolean;
  fechaAutorizacion: string;
  fechaEfectivizacion?: string;
  cuitPrescriptor: string;
  cuitEfector: string;
  matriculaPrescriptor: string;
  matriculaEfector: string;
  diagnostico: string;
  documentoAfiliado: string;
  nroAfiliado: string;
  codigoPractica: string;
  cantidad: number;
  coseguro: number;
  montoFacturado: number;
  fila: number;
};
