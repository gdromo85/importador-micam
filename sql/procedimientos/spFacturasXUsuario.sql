--spFacturasXUsuario 1
alter procedure spFacturasXUsuario
  @Usuario int
  
as
    declare @intError int
    	
	Select codigo, comprobante, proveedor, fecha, periodo, usuario
	from Facturas
	where usuario  = @Usuario
	set @intError = @@Error
	if (@intError <> 0) goto onError
	
return @intError
onError:

  return @intError
go

