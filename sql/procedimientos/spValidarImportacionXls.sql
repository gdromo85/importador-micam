
alter procedure spValidarImportacionXls
  @nroAutorizacion				int,
  @isMicam						bit,
  @isInternado					bit,
  @fechaAutorizacion			smalldatetime,
  @fechaEfectivizacion			smalldatetime,
  @cuitPrescriptor				varchar (20),
  @cuitEfector					varchar (20) = null,
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
	declare @varError varchar(max)

	set @varError = ''
	set @intError = 0
    /*Verifico si @cuitPrescriptor existe*/
	if not exists (select * 
				from Cuit
				where Cuit  = @cuitPrescriptor
				 ) begin
		set @varError =  @varError + 'El cuit del prescriptor no existe' + ' - '
		
		set @intError = 1
        
	end

	/*Verifico si @cuitEfector existe*/
	if @cuitEfector is not null 
		and not exists (select * 
				from Cuit
				where Cuit  = @cuitEfector
				 ) begin
		
		set @varError =  @varError + 'El cuit del Efector no existe' + ' - '
		set @intError = 1
        
	end
	

	select @intError as intError, @varError as varError

return @intError
onError:

  return @intError
go

