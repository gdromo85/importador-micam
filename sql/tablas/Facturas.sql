
create table Facturas (
codigo						int  identity(1, 1),
comprobante					varchar (100),
proveedor					varchar (20),
fecha						smalldatetime,
periodo						varchar (100),
usuario						int

   constraint PK_Facturas primary key (Codigo),
   
)
go
