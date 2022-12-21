--spUsuarioValidarSel '1','1'
alter procedure spUsuarioValidarSel
  @NombreUsuario varchar (128) = null,
  @Contrasena varchar (128) = null

as
    declare @intError int
    

	/*Verifico si existe*/
	if exists (select * 
				from Usuario u 
				where u.NombreUsuario  = @NombreUsuario
				 and  u.Contrasena = @Contrasena 
				 and u.Habilitado= 0) begin
		RAISERROR ('El usuario esta deshabilitado', 16,1)
		
		set @intError = @@Error
        if (@intError <> 0) goto onError
	end

	if not exists (select * 
				from Usuario u 
				where u.NombreUsuario  = @NombreUsuario
				 and  u.Contrasena = @Contrasena 
				 and u.Habilitado= 1) begin
		RAISERROR ('El usuario no existe', 16,1)
		
		set @intError = @@Error
        if (@intError <> 0) goto onError
	end
	
	
	
	Select u.Codigo, u.NombreUsuario , u.NombreCompleto,
		u.Habilitado, u.Rol, u.Contrasena
	from Usuario u
	where u.NombreUsuario  = @NombreUsuario
	and  u.Contrasena = @Contrasena 
	set @intError = @@Error
	if (@intError <> 0) goto onError
	
return @intError
onError:

  return @intError
go

