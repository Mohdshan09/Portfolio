# File Upload Security

- [ ] Admin-only endpoint.
- [ ] `multer` memory storage with limits: images ≤ 5 MB, PDF ≤ 5 MB, 1 file per request.
- [ ] Validate by magic bytes (`file-type`), not just extension/mimetype.
- [ ] Allowed: jpeg, png, webp, avif, pdf. SVG **not** allowed (XSS vector).
- [ ] Upload straight to Cloudinary with a fixed folder (`portfolio/`), random public IDs.
- [ ] Store `publicId`; delete asset on record delete/replace.
- [ ] Strip EXIF metadata (Cloudinary `strip` flag or sharp).
