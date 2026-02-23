## Packages
@google/model-viewer | Web Component for rendering interactive 3D models
framer-motion | Smooth page transitions and stagger animations for the product grid

## Notes
@google/model-viewer is a web component. It will be imported in the ModelViewer component.
The app is a read-only showcase, so there are no mutations (create/update/delete) implemented in the UI, only queries.
Price is stored in cents in the database, so it must be divided by 100 for display.
