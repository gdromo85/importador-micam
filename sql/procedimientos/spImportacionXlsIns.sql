--spUsuarioValidarSel '1','1'
alter procedure spImportacionXlsIns
  @nroFactura					varchar (100),
  @usuario						int,
  @nroAutorizacion				varchar (20),
  @isMicam						bit,
  @isInternado					bit,
  @fechaAutorizacion			smalldatetime,
  @fechaEfectivizacion			smalldatetime,
  @cuitPrescriptor				varchar (20),
  @cuitEfector					varchar (20)= null,
  @matriculaPrescriptor			varchar (20),
  @matriculaEfector				varchar (20),
  @diagnostico					varchar (20),
  @documentoAfiliado			varchar (20) = null,
  @nroAfiliado					varchar (20) = null,
  @codigoPractica				varchar (20),
  @cantidad						int,
  @coseguro						int,
  @montoFacturado				int

as
    declare @intError int
    

	insert ImportacionXls (nroFactura, usuario, nroAutorizacion, isMicam, isInternado, fechaAutorizacion, fechaEfectivizacion, 
		cuitPrescriptor, cuitEfector, matriculaPrescriptor, matriculaEfector, diagnostico, documentoAfiliado, nroAfiliado, 
		codigoPractica, cantidad, coseguro, montoFacturado)
		values(@nroFactura, @usuario, @nroAutorizacion, @isMicam, @isInternado, @fechaAutorizacion, @fechaEfectivizacion, 
			@cuitPrescriptor, @cuitEfector, @matriculaPrescriptor, @matriculaEfector, @diagnostico, @documentoAfiliado, @nroAfiliado, 
			@codigoPractica, @cantidad, @coseguro, @montoFacturado)
	set @intError = @@Error
	if (@intError <> 0) goto onError
	
return @intError
onError:

  return @intError
go

