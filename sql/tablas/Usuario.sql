
create table Usuario (
Codigo					int  identity(1, 1),
NombreUsuario			varchar (128),
NombreCompleto			varchar (128),
Contrasena				varchar (128),
Habilitado				int,
Rol						int,

   constraint PK_Usuario primary key (Codigo), 
)
go

