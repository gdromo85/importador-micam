import * as React from "react";
import { useState, createRef } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import dayjs from "dayjs";

import { ThemeProvider, createTheme } from "@mui/material";

import { useUsuarioStore } from "../../../tienda";
import { styled } from "@mui/material/styles";

import MaterialTable from "material-table";
import ReactExport from "react-export-excel";
import LoadingOverlay from "react-loading-overlay";

import { OutTable, ExcelRenderer } from "react-excel-renderer";
import axios from "axios";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Home() {
  const usuario = useUsuarioStore((state) => state.usuario);

  const defaultMaterialTheme = createTheme();
  //const [email, setEmail] = useState('');
  const [state, setState] = useState({
    isOpen: false,
    dataLoaded: false,
    isFormInvalid: true,
    rows: null,
    cols: null,
    rowsmostrar: null,
  });
  const [facturasMostrar, setFacturasMostrar] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [open, setOpen] = useState(false);
  const [openImportado, setOpenImportado] = useState(false);
  const [openConfirmacion, setOpenConfirmacion] = useState(false);

  const [errores, setErrores] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [registros, setRegistros] = useState({
    total: 0,
    errores: 0,
  });
  const [nombreArchivo, setNombreArchivo] = useState("Arch");

  const [correctos, setCorrectos] = useState([]);

  const fileInput = createRef();
  const [snack, setSnack] = React.useState({
    open: false,
    tipo: "",
    mensaje: "",
  });

  React.useEffect(() => {
    
    traerFacturas();
  }, []);

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack({ ...snack, open: false });
  };

  const handleCloseConfirmacion = () => {
    setOpenConfirmacion(false);
  };

  const onClickConfirmacionNo = () => {
    handleCloseConfirmacion();
  };

  const onClickConfirmacionSi = () => {
    handleCloseConfirmacion();
    setOpen(false);
    setState({
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: true,
      rows: null,
      cols: null,
      rowsmostrar: null,
      uploadedFileName: "",
    });
    setSelectedRow(null);
    setSnack({
      ...snack,
      open: true,
      tipo: "info",
      mensaje: "Se desestimaron los datos",
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickFinalizar = async () => {
    guardarBD();
  };
  const handleClickDesestimar = async () => {
    setOpenConfirmacion(true);
  };

  const handleCloseImportado = () => {
    setOpenImportado(false);
  };

  const renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
        setSnack({ ...snack, open: true, tipo: "error", mensaje: err });
      } else {
        let i = 0;
        let mostrar = [];

        if (verificarEncabezado(resp.rows[0])) {
          resp.rows.forEach((element) => {
            if (i < 6) mostrar.push(element);
            i++;
          });

          setState({
            dataLoaded: true,
            cols: resp.cols,
            rows: resp.rows,
            rowsmostrar: mostrar,
            isFormInvalid: false,
          });
          setOpenImportado(true);
        } else {
          setSnack({
            ...snack,
            open: true,
            tipo: "error",
            mensaje: "Encabezado del archivo no tiene el formato correcto",
          });
          setState({
            isFormInvalid: true,
            uploadedFileName: "",
          });
        }
      }
    });
  };
  const fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (
        fileName.slice(fileName.lastIndexOf(".") + 1) === "xlsx" ||
        fileName.slice(fileName.lastIndexOf(".") + 1) === "xls"
      ) {
        setState({
          uploadedFileName: fileName,
          isFormInvalid: false,
        });
        renderFile(fileObj);
      } else {
        setSnack({
          ...snack,
          open: true,
          tipo: "error",
          mensaje: "Archivo no soportado",
        });
        setState({
          isFormInvalid: true,
          uploadedFileName: "",
        });
      }
    }
  };

  const openFileBrowser = () => {
    if (selectedFactura === null) {
      setSnack({
        ...snack,
        open: true,
        tipo: "warning",
        mensaje: "Debe seleccionar una factura",
      });
      return;
    }

    fileInput.current.click();
  };

  const btnGuardar = async () => {
    handleCloseImportado();
    if (selectedFactura === null) {
      setSnack({
        ...snack,
        open: true,
        tipo: "warning",
        mensaje: "Debe seleccionar una factura",
      });
      return;
    }

    if (state.isFormInvalid) {
      setSnack({
        ...snack,
        open: true,
        tipo: "warning",
        mensaje: "Debe seleccionar un archivo a importar",
      });
      return;
    }
    setCargando(true);

    procesarArchivo(state.rows);
  };
  const procesarArchivo = (archivo) => {
    let errores = [];

    let cantidadRegistro = 0;
    let cantidadError = 0;
    let banError = false;
    let correctos = [];

    archivo.forEach((element, i) => {
      if (i > 0) {
        if (isNaN(element[0])) {
          errores.push({
            posicion: i + 1,
            problema: "NroAutorizacion no es numerico",
          });
          banError = true;
        }
        if (isNaN(element[1]) || (element[1] !== 0 && element[1] !== 1)) {
          errores.push({ posicion: i + 1, problema: "isMicam invalido" });
          banError = true;
        }
        if (
          !isNaN(element[2]) ||
          (element[2] !== "AMB" && element[2] !== "INT")
        ) {
          errores.push({
            posicion: i + 1,
            problema: "isInternado solo acepta AMB o INT",
          });
          banError = true;
        }
        if (
          isNaN(element[3]) ||
          !dayjs(element[3].toString(), "YYYYMMDD", true).isValid()
        ) {
          errores.push({
            posicion: i + 1,
            problema: "fechaAutorización debe tener el formato YYYYMMDD",
          });
          banError = true;
        }

        if (isNaN(element[4])) {
          if (element[4] !== "NULL") {
            errores.push({
              posicion: i + 1,
              problema:
                "fechaEfectivización debe ser NULL o tener el formato YYYYMMDD",
            });
            banError = true;
          }
        } else {
          if (!dayjs(element[4].toString(), "YYYYMMDD", true).isValid()) {
            errores.push({
              posicion: i + 1,
              problema:
                "fechaEfectivización debe ser NULL o tener el formato YYYYMMDD",
            });
            banError = true;
          }
        }

        if (isNaN(element[5])) {
          errores.push({
            posicion: i + 1,
            problema: "el CuitPrescriptor debe ser solo numerico",
          });
          banError = true;
        } else {
          if (element[5].toString().length !== 11) {
            errores.push({
              posicion: i + 1,
              problema: "el CuitPrescriptor debe tener 11 digitos",
            });
            banError = true;
          }
        }

        if (isNaN(element[6])) {
          errores.push({
            posicion: i + 1,
            problema: "el CuitEfector debe ser solo numerico",
          });
          banError = true;
        } else {
          if (element[6].toString().length !== 11) {
            errores.push({
              posicion: i + 1,
              problema: "el CuitEfector debe tener 11 digitos",
            });
            banError = true;
          }
        }

        //MatriculaPrescriptor	7

        //MatriculaEfector 8

        if (!isNaN(element[9])) {
          errores.push({
            posicion: i + 1,
            problema: "Diagnostico solo acepta texto",
          });
          banError = true;
        }

        //DocumentoAfiliado 10 	NroAfiliado 11
        if (isNaN(element[10]) && isNaN(element[11])) {
          errores.push({
            posicion: i + 1,
            problema:
              " se debe ingresar un DocumentoAfiliado y/o NroAfiliado valido",
          });
          banError = true;
        }
        //codigoPractica 12

        if (isNaN(element[13])) {
          errores.push({
            posicion: i + 1,
            problema: "cantidad no es numerico",
          });
          banError = true;
        }
        if (isNaN(element[14])) {
          errores.push({
            posicion: i + 1,
            problema: "coseguro no es numerico",
          });
          banError = true;
        }
        if (isNaN(element[15])) {
          errores.push({
            posicion: i + 1,
            problema: "montoFacturado no es numerico",
          });
          banError = true;
        }

        cantidadRegistro++;

        if (banError) {
          cantidadError++;
          banError = false;
        } else {
          correctos.push({
            nroAutorizacion: element[0],
            isMicam: element[1],
            isInternado: element[2],
            fechaAutorizacion: element[3],
            fechaEfectivizacion: element[4],
            cuitPrescriptor: element[5],
            cuitEfector: element[6],
            matriculaPrescriptor: element[7],
            matriculaEfector: element[8],
            diagnostico: element[9],
            documentoAfiliado: element[10],
            nroAfiliado: element[11],
            codigoPractica: element[12],
            cantidad: element[13],
            coseguro: element[14],
            montoFacturado: element[15],
            fila: i + 1,
          });
        }
      }
    });

    verificarBD(correctos, errores, cantidadRegistro, cantidadError);
  };

  const verificarBD = async (
    datos,
    erroresLoc,
    cantidadRegistro,
    cantidadError
  ) => {
    var config = {
      headers: { Authorization: `Bearer ${usuario.token}` },
    };

    await axios
      .post(
        `http://localhost:3500/importacion/validar/`,
        {
          usuario: usuario,
          data: datos,
        },
        config
      )
      .then(function (response) {
        //console.log('response');
        //console.log(response);

        setCorrectos(response.data.correctos);

        if (response.data.errores.length > 0) {
          let nvosErrores = response.data.errores;
          nvosErrores.forEach((element) => {
            erroresLoc.push(element);
          });
        }
        
        erroresLoc.sort((a,b) => (a.posicion > b.posicion) ? 1 : ((b.posicion > a.posicion) ? -1 : 0));  
        setErrores(erroresLoc);
        cantidadError = cantidadError + response.data.errores.length;
      })
      .catch(function (error) {
        console.log("error", error);
        ///Quitar en produccion

        setSnack({
          ...snack,
          open: true,
          tipo: "error",
          mensaje: "Error al validar",
        });
        setCargando(false);
      });
    setRegistros({
      total: cantidadRegistro,
      errores: cantidadError,
    });

    handleClickOpen();
    setCargando(false);
  };

  const verificarEncabezado = (archivo) => {
    let encabezadoCorrecto = [
      "NroAutorizacion",
      "isMicam",
      "isInternado",
      "fechaAutorización",
      "fechaEfectivización",
      "CuitPrescriptor",
      "CuitEfector",
      "MatriculaPrescriptor",
      "MatriculaEfector",
      "Diagnostico",
      "DocumentoAfiliado",
      "NroAfiliado",
      "codigoPractica",
      "cantidad",
      "coseguro",
      "montoFacturado",
    ];

    for (let i = 0; i < archivo.length; i++) {
      if (archivo[i] !== encabezadoCorrecto[i]) {
        return false;
      }
    }
    return true;
  };

  const inicializarVentana = () => {
    setState({
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: true,
      rows: null,
      cols: null,
      rowsmostrar: null,
      uploadedFileName: "",
    });
    setSelectedRow(null);
    setSelectedFactura(null);
    traerFacturas();
  };

  const clickTable = (item) => {
    setSelectedRow(item.tableData.id);
    setSelectedFactura(item);

    setNombreArchivo("Errores de importacion - " + item.comprobante);
  };

  const guardarBD = async () => {
    console.log(selectedFactura);
    console.log(correctos);
    console.log(usuario);
    setCargando(true);
    setOpen(false);

    var config = {
      headers: { Authorization: `Bearer ${usuario.token}` },
    };

    await axios
      .post(
        `http://localhost:3500/importacion/registrar/`,
        {
          usuario: usuario,
          data: correctos,
          factura: selectedFactura,
        },
        config
      )
      .then(function (response) {
        //console.log('response');
        //console.log(response);

        

        setCargando(false);
        setSnack({
          ...snack,
          open: true,
          tipo: "success",
          mensaje: "Se guardaron los datos",
        });
        inicializarVentana();
      })
      .catch(function (error) {
        console.log("error", error);
        ///Quitar en produccion

        setSnack({
          ...snack,
          open: true,
          tipo: "error",
          mensaje: "Error al validar",
        });
        setCargando(false);
      });
  };

  const traerFacturas = async () => {
    var config = {
      headers: { Authorization: `Bearer ${usuario.token}` },
    };

    setCargando(true);
    await axios
      .post(
        `http://localhost:3500/importacion/facturas`,
        {
          usuario: usuario,
        },
        config
      )
      .then(function (response) {
        //console.log('response');
        //console.log(response);
        if (response.data.length > 0) {
          
          setFacturasMostrar(response.data)
        } else {
          setSnack({
            ...snack,
            open: true,
            tipo: "warning",
            mensaje: "No hay facturas para traer",
          });
        }
        setCargando(false);
      })
      .catch(function (error) {
        console.log("error", error);
        ///Quitar en produccion

        setSnack({
          ...snack,
          open: true,
          tipo: "error",
          mensaje: "Error al traer facturas",
        });
        setCargando(false);
      });
  };

  return (
    <LoadingOverlay active={cargando} spinner text="Buscando datos ...">
      {/**
       *  severity="error"
          severity="warning"
          severity="info"
          severity="success"
       */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={handleCloseSnack}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snack.tipo}
          sx={{ width: "100%" }}
        >
          {snack.mensaje}
        </Alert>
      </Snackbar>
      <Box
        px={1}
        width="100%"
        height="100vh"
        mx="auto"
        position="relative"
        zIndex={2}
      >
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Grid item xs={11}>
            <Card>
              <Box
                pt={12}
                pb={1}
                px={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Avatar sx={{ m: 1, bgcolor: "#9c27b0" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h4" fontWeight="medium" textAlign="center">
                  Importar ordenes
                </Typography>
              </Box>

              <Box pt={1} pb={1} px={3}>
                <Grid container spacing={1} pt={1} pb={3}>
                  <Grid item xs={12}>
                    <h5 style={{ margin: "0px" }}>
                      Utilice los filtros de la grilla, seleccione la factura
                      que se quieren importar los datos, luego presionar el
                      botón "Importar Archivo" y seleccione el XLS
                    </h5>
                  </Grid>
                  <Grid style={{ marginTop: "15px" }} item xs={9}>
                    {selectedFactura === null ? (
                      <h3 style={{ marginTop: "0px" }}>
                        Seleccionar una factura
                      </h3>
                    ) : (
                      <h3
                        style={{ marginTop: "0px" }}
                      >{`Factura seleccionada ${selectedFactura.comprobante}`}</h3>
                    )}
                  </Grid>
                  <Grid
                    style={{ marginTop: "15px" }}
                    item
                    xs={3}
                    justifyContent="flex-end"
                  >
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="flex-start"
                    >
                      <Button variant="contained" onClick={openFileBrowser}>
                        Importar archivo
                      </Button>

                      <input
                        type="file"
                        accept=".xls,.xlsx"
                        hidden
                        onChange={fileHandler}
                        ref={fileInput}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        style={{ padding: "10px", margin: "10px" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <ThemeProvider theme={defaultMaterialTheme}>
                      <MaterialTable
                        title="Facturas Pendientes"
                        columns={[
                          { title: "Comprobante", field: "comprobante" },
                          { title: "Proveedor", field: "proveedor" },
                          { title: "Fecha", field: "fecha" },
                          { title: "Periodo", field: "periodo" },
                        ]}
                        data={facturasMostrar}
                        options={{
                          filtering: true,
                          rowStyle: (rowData) => ({
                            backgroundColor:
                              selectedRow === rowData.tableData.id
                                ? "#1B2631"
                                : "#FFF",
                            color:
                              selectedRow === rowData.tableData.id
                                ? "#FFF"
                                : "#17202A",
                          }),
                        }}
                        localization={{
                          body: {
                            emptyDataSourceMessage:
                              "No hay registros que mostrar",
                            addTooltip: "Agregar",
                            deleteTooltip: "Quitar",
                            editTooltip: "Editar",
                            filterRow: {
                              filterTooltip: "Filtrar",
                            },
                            editRow: {
                              deleteText: "Quieres eliminar esta línea?",
                              cancelTooltip: "Anular",
                              saveTooltip: "Guardar",
                            },
                          },
                          grouping: {
                            placeholder: "Tirar encabezado ...",
                            groupedBy: "Agrupar por:",
                          },
                          header: {
                            actions: "Accion",
                          },
                          pagination: {
                            labelDisplayedRows: "{from}-{to} de {count}",
                            labelRowsSelect: "Líneas",
                            labelRowsPerPage: "Líneas por pagina:",
                            firstAriaLabel: "Primera página",
                            firstTooltip: "Primera página",
                            previousAriaLabel: "Página anterior",
                            previousTooltip: "Página anterior",
                            nextAriaLabel: "Página siguiente ",
                            nextTooltip: "Página siguiente",
                            lastAriaLabel: "Última página",
                            lastTooltip: "Última página",
                          },
                          toolbar: {
                            addRemoveColumns: "Agregar o quitar columnas",
                            nRowsSelected: "{0} línea(s) seleccionado(s)",
                            showColumnsTitle: "Ver columnas",
                            showColumnsAriaLabel: "Ver columnas",
                            exportTitle: "Exportar",
                            exportAriaLabel: "Exportar",
                            exportName: "Exportar en CSV",
                            searchTooltip: "Buscar",
                            searchPlaceholder: "Buscar",
                          },
                        }}
                        onRowClick={(event, rowData) => clickTable(rowData)}
                      />
                    </ThemeProvider>
                  </Grid>
                </Grid>
                <br />
                <br />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={open}
        onClose={handleClickDesestimar}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h4 style={{ margin: "0px" }}>Listado de Errores</h4>
          <h5
            style={{ margin: "0px" }}
          >{`Registros total: ${registros.total} - erroneos: ${registros.errores}`}</h5>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Linea</TableCell>
                  <TableCell>Problema</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {errores.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.posicion}
                    </TableCell>
                    <TableCell>{row.problema}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleClickDesestimar}
                >
                  Desestimar
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-start"
              >
                <ExcelFile
                  element={
                    <Button
                      variant="contained"
                      size="small"
                      disabled={errores.length === 0 ? true : false}
                    >
                      Exportar errores
                    </Button>
                  }
                  filename={nombreArchivo}
                >
                  <ExcelSheet data={errores} name="Errores">
                    <ExcelColumn label="Linea" value="posicion" />
                    <ExcelColumn label="Problema" value="problema" />
                  </ExcelSheet>
                </ExcelFile>
                <Button
                  onClick={handleClickFinalizar}
                  style={{ marginLeft: "20px" }}
                  autoFocus
                >
                  Finalizar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openImportado}
        onClose={handleCloseImportado}
        maxWidth={"lg"}
        aria-labelledby="alert-dialog-title-importacion"
        aria-describedby="alert-dialog-description-importacion"
      >
        <DialogTitle id="alert-dialog-title-importacion">
          <h4 style={{ marginTop: "0px" }}>Muestra de Importación de datos</h4>
          {selectedFactura === null ? (
            <h4 style={{ marginTop: "0px" }}>Seleccionar una factura</h4>
          ) : (
            <h4
              style={{ marginTop: "0px" }}
            >{`Nro de Factura: ${selectedFactura.comprobante}`}</h4>
          )}
        </DialogTitle>
        <DialogContent>
          <div class="containerScrollH">
            <Grid item xs={12}>
              <OutTable
                data={state.rowsmostrar}
                columns={state.cols}
                tableClassName="ExcelTable2007"
                tableHeaderRowClass="heading"
              />
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={btnGuardar}
            disabled={selectedFactura === null}
          >
            Validar importacion
          </Button>

          <Button onClick={handleCloseImportado} autoFocus>
            Desestimar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmacion}
        onClose={handleCloseConfirmacion}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Esta seguro que va a desestimar la importación?"}
        </DialogTitle>
        <DialogContent>
          <h5 style={{ marginTop: "0px" }}>
            Todas las validaciones del archivo importado se perderán
          </h5>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickConfirmacionNo}>NO</Button>
          <Button onClick={onClickConfirmacionSi} autoFocus>
            SI
          </Button>
        </DialogActions>
      </Dialog>
    </LoadingOverlay>
  );
}

export default Home;
