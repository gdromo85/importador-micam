
create table ImportacionXls (
codigo						int  identity(1, 1),
nroFactura					varchar (100),
usuario						int,
nroAutorizacion				varchar (20),
isMicam						bit,
isInternado					bit,
fechaAutorizacion			smalldatetime,
fechaEfectivizacion			smalldatetime,
cuitPrescriptor				varchar (20),
cuitEfector					varchar (20),
matriculaPrescriptor		varchar (20),
matriculaEfector			varchar (20),
diagnostico					varchar (20),
documentoAfiliado			varchar (20),
nroAfiliado					varchar (20),
codigoPractica				varchar (20),
cantidad					int,
coseguro					int,
montoFacturado				int,
idcomprobante				int,
idproveedor					int,
idprestador_prescriptor		int,
idprestador_efector			int,
idmedico_prescriptor		int,
idmedico_efector			int,
idgrupo_integrante			int,
idplan_cobertura			int,
idnomenclador				int,
carga_ok					bit,
fecha_hora_proceso_carga	datetime

   constraint PK_ImportacionXls primary key (Codigo), 
)
go

  