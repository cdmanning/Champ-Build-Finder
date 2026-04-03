## 🛠️ In Progress
- [ ] [FEAT] Add feature allowing for custom user aliases when loading `champions.json`.
- [ ] [UX] Add MOBAFire support.
- [ ] [FEAT] Add tierlist support (e.g. Role-based Tierlists, Mode-based Tierlists)

## 🧪 Automated Testing (Playwright)
- [ ] [TEST] Configure Github Actions to run tests automatically.

## ✅ Completed
- [x] [DATA] Create champions.json file to map champion names to slugs.
- [x] [UI] Design and build the extension popup interface for site selection.
- [x] [FEAT] Add search functionality for build analytics sites (Poro.gg, U.gg, OP.gg, etc.)
- [x] [TEST] Confirm that the correct page loads for each champion alias for every supported site.
- [x] [TEST] Confirm incorrect entry fallback to the preselected analytics site. 
- [x] [DATA] Implement exceptions.json to handle site-specific URL overrides for non-standard champion slugs.

---

## 🏷️ Tag Glossary & Descriptions
This list is to provide tags for the grouping of tasks that are planned. Tags ensure that changes can be made faster when in internal development as compared to managing Github issues.
| Tag | Category | Description |
| :--- | :--- | :--- |
| **`[FEAT]`** | Feature | New functionality idea for the project. |
| **`[UI]`** | Interface | Updating the visual styling and appeal of the site or project. |
| **`[UX]`** | Experience | Improving site or project navigation or visual comprehension. |
| **`[DATA]`** | Metadata | Updates to data pipelines and storage (JSON, XML, Database). |
| **`[TEST]`** | Validation | Playwright test scripts and validation logic. |
| **`[INFRA]`** | Infrastructure | DNS, Domains, Subdomains and deployments. |
| **`[DOCS]`** | Documentation | Updates to README.md or other markdown files. |
| **`[SEO]`** | Discovery | Search engine registration, analytics, and engine files (robots.txt, sitemap.xml). |
| **`[PAGE]`** | Site Update | Creation of new pages on the site. |
| **`[ASSETS]`** | Media | Graphic design, icons, promotional materials, and image optimization. | 
