# About the 'Project UShell'

This is the idea of building a 'universal' shell in the form of an SPA that can host any web application. The current paradigm of configurable application modules (keyword 'composite application') in combination with the "WebComponents" standard enables us to create a product which is put together from several decentrally hosted components. In addition, an interaction between these modules should be made possible. In addition, it should also be possible to define various standard use cases, such as processing a list of data records in the form of simple CRUD operations, purely configuratively. In the latter case, no frontend development is necessary at all - only a web service in the Backend...

# About this Repo

The 'Common Components' for JS is a collection of default ('out of the box') Module-parts that can be used when defining a UShell-Module only by configuration. This includes:

- Common UI (WebComponents) for:
  - CRUD-Operations on Entity-Lists (DataGrid)
  - Editing single Entites oder Scalar-Settings
  - Displaying Logs
  - Displaying PDF-Files
  - ...
- Common Datasources for CRUD-Access via:
  - REST
  - UJMW
- Clients & Communication Contract for (asynchonous)Backend-Jobs & Notfications
