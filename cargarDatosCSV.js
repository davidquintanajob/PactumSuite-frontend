import fs from 'fs';
import { parse } from 'csv-parse/sync';
import fetch from 'node-fetch';
import { createObjectCsvWriter } from 'csv-writer';

const API_URL = 'http://localhost:4000';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm5vbWJyZSI6IkpvcmdlIiwibm9tYnJlX3VzdWFyaW8iOiJqb3JnZSIsInJvbCI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NjAzNjA1NzcsImV4cCI6MTc2MDM3MTM3N30.GpoUnmBNyXyTderRRNEEa8bYXIbkli-ilrgks0A9pVo";
const successfulClientes = [];
const successfulFacturas = [];

function readCSVSync(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });
}

async function main() {
  try {
    // Leer los archivos CSV
    const usuarios = readCSVSync('usuarios.csv');
    const tipo_contratos = readCSVSync('tipo_contratos.csv');
    const entidades = readCSVSync('entidades.csv');
    const contratos = readCSVSync('contratos.csv');
    const facturas = readCSVSync('facturas.csv');
    const facturasAPI = readCSVSync('facturasAPI.csv');

    console.log(`Cargados ${tipo_contratos.length} tipo_contratos, ${entidades.length} entidades, ${contratos.length} contratos, ${facturas.length} facturas`);

    console.log(".....................Procesando usuarios.......................");
    // Procesar usuarios
    for (const usuario of usuarios) {
      try {
        const responseCreateTipo_contrato = await fetch(`${API_URL}/Usuario/CreateUsuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            nombre: usuario.nombre,
            nombre_usuario: usuario.nombre_usuario,
            cargo: usuario.cargo,
            contrasenna: "Abcd.1234",
            rol: usuario.rol,
            activo: usuario.activo,
            carnet_identidad: usuario.carnet_identidad
          })
        });
        if (responseCreateTipo_contrato.ok) {
          console.log(`U: ${usuario.nombre}`);
        } else {
          console.log(`Error al incertar ${usuario.nombre}`);
        }
      } catch (error) {
        console.error(`Error al procesar usuarios: ${error}`);
      }
    }
    
    console.log(".....................Procesando tipos de contratos.......................");
    // Procesar tipos de contratos
    for (const tipo_contrato of tipo_contratos) {
      try {
        const responseCreateTipo_contrato = await fetch(`${API_URL}/tipoContrato/CreateContrato`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            nombre: tipo_contrato.nombre
          })
        });
        if (responseCreateTipo_contrato.ok) {
          console.log(`TC: ${tipo_contrato.nombre}`);
        } else {
          console.log(`Error al incertar ${tipo_contrato.nombre}`);
        }
      } catch (error) {
        console.error(`Error al procesar tipos de contratos: ${error}`);
      }
    }

    console.log("....................Precsando entidades.............................");
    // Procesar entidades
    for (const entidad of entidades) {
      try {
        const responseEntidad = await fetch(`${API_URL}/Entidad/CreateEntidad`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            nombre: entidad.nombre,
            direccion: entidad.direccion,
            telefono: entidad.telefono,
            consecutivo: entidad.consecutivo,
            cuenta_bancaria: entidad.cuenta_bancaria,
            tipo_entidad: entidad.tipo_entidad
          })
        });
        if (responseEntidad.ok) {
          console.log(`E: ${entidad.nombre}`);
        } else {
          console.log(`Error al crear entidad: ${entidad.nombre}`);
        }
      } catch (error) {
        console.error(`Error al procesar entidades: ${error}`);
      }
    }
    
    console.log("....................Precsando contratos.............................");
    // Procesar contratos
    let auxIndex = 1;
    for (const contrato of contratos) {
      let entidadOfContrato;
      let tipo_contratoOfContrato;

      // Buscar en el csv la entidad que pertenece este contrato y romper el ciclo cuando la encuentre
      for (const entidad of entidades) {
        if (contrato.id_entidad === entidad.id_entidad) {
          entidadOfContrato = entidad;
          break;
        }
      }
      // Buscar e el cvs el tipo de contrato de este contrato y romper el ciclo cuando lo encuentre
      for (const tipo_contrato of tipo_contratos) {
        if (contrato.id_tipo_contrato === tipo_contrato.id_tipo_contrato) {
          tipo_contratoOfContrato = tipo_contrato
          break;
        }
      }

      // Si se encontraro resultados en el csv se busca dicha información en la API para optener sus datos reales
      if (entidadOfContrato && tipo_contratoOfContrato) {
        try {
          const resultEntidadOfAPI = await fetch(`${API_URL}/entidad/filter/1/1`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({
              nombre: entidadOfContrato.nombre
            })
          });
          const responseAPI = await resultEntidadOfAPI.json();
          if (responseAPI && responseAPI.data && responseAPI.data.length > 0) {
            const entidadAPI = responseAPI.data[0];
            try {
              const resulContrato = await fetch(`${API_URL}/contrato/CreateContrato`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                },
                body: JSON.stringify({
                  id_entidad: entidadAPI.id_entidad,
                  id_tipo_contrato: auxIndex,
                  fecha_inicio: contrato.fecha_inicio,
                  fecha_fin: contrato.fecha_fin,
                  num_consecutivo: contrato.num_consecutivo,
                  ClienteOProveedor: contrato.ClienteOProveedor,
                  vigenciaFacturasDias: contrato.vigenciaFacturasDias
                })
              });
              if (resulContrato.ok) {
                console.log(`C: Contrato de ${entidadAPI.nombre}`);
              } else {
                const error = await resulContrato.json()
                console.log(`Error al crear contrato:`, error);
              }
            } catch (error) {
              console.log("Error incertando contrato en el metodo post", error);
            }
          } else {
            console.log(`Entidad ${entidadOfContrato.nombre} no encontrada en la API`);
          }
        } catch (error) {
          console.error(`Error filtrando entidad para crear contrato: ${error}`);
        }
      } else {
        console.error(`Error al crear contrato. No se encontró entidad o el tipo de contrato en el csv`);
      }
      auxIndex++;
      if (auxIndex === 3) {
        auxIndex = 1
      }
    }

    console.log("....................Precsando facturas.............................");
    //Procesando facturas
    for (const factura of facturas) {
      try {
        const resultEntidadOfAPI = await fetch(`${API_URL}/contrato/filter/1/2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            nombre_entidad: factura.cliente
          })
        });
        const contratos = (await resultEntidadOfAPI.json()).data;
        let contratoOfFactura;

        for (const contrato of contratos) {
          if (contrato.tipoContrato = "Prestación de Servicios") {
            contratoOfFactura = contrato;
            break;
          }
        }
        
        // Build services array
        let services = [];
        for (let i = 1; i <= 10; i++) {
          const desc = factura[`descripcion${i}`];
          if (desc && desc.trim() !== '') {
            services.push({
              descripcion: desc,
              cantidad: parseFloat(factura[`cantidad${i}`]) || 0,
              importe: parseFloat(factura[`importe${i}`]) || 0,
              unidadMedida: 'unidad'
            });
          }
        }

        const resultFactura = await fetch(`${API_URL}/factura/createFactura`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            num_consecutivo: factura.id_consecutivo,
            fecha: (new Date),
            estado: 'Facturado',
            id_contrato: contratoOfFactura.id_contrato,
            id_usuario: 1,
            services: services
          })
        });
        if (resultFactura.ok) {
          console.log(`F: Factura ${factura.id_consecutivo}`);
        } else {
          const error = await resultFactura.json();
          console.log(`Error al crear factura:`, error);
        }
      } catch (error) {
        console.log("Error al crear factura: ", error);
      }
    }
  } catch (error) {
    console.error('Error leyendo los archivos CSV:', error);
  }
}

main();
