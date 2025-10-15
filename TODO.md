# TODO List for cargarDatosCSV.js Modifications

- [x] Add import for csv-writer
- [x] Declare successfulClientes array
- [x] Add flag successful in contract loop
- [x] Set successful = false on filter or contract errors
- [x] Push to successfulClientes if successful
- [x] Filter clientes to remove successful and rewrite clientes.csv
- [x] Add loop to iterate over clientes again for contracts
- [x] Call /entidad/filter/1/1 to get id_entidad
- [x] Create two contracts per cliente using /contrato/createContrato with dynamic dates (now to now+1 year)
- [x] Process invoices from facturas.csv
- [x] Call /contrato/filter/1/1 to get id_contrato for each invoice
- [x] Create invoices with /Factura/CreateFactura, building services array from CSV columns
- [x] Remove successfully processed invoices from facturas.csv
