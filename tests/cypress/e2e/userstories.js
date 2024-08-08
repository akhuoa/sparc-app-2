/**
 * In order to reduce the number of service requests and not affect Content QC.
 * The following test cases are temporarily commented out in case they will be needed in the future.
 */

// // To check the segmentation card
// // should use datasets which have segmentation data
// const segmentationDatasetIds = [226, 77]
// const scaffoldDatasetCategories = ['pig colon', 'pig heart']
// const categories = ['stomach', 'lung']

// describe('User stories', function () {
//   describe('Should find segmentation in the gallery', { testIsolation: false }, function () {
//     beforeEach('Loading Datasets', function () {
//       cy.visitLoadedPage('');

//       // Navigate to 'Data&Models' page
//       cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').click();

//       cy.waitForLoadingMask()

//     })

//     segmentationDatasetIds.forEach((id) => {

//       it(`Access dataset ${id}`, function () {
//         // Search for segmentation related dataset
//         cy.get('.el-input__wrapper > .el-input__inner').clear();
//         cy.get('.search-text').click();
//         cy.get('.el-table__row', { timeout: 30000 }).should('have.length', 10)

//         cy.get('.el-input__wrapper > .el-input__inner').type(id);
//         cy.get('.search-text').click();

//         cy.get('.el-table__row', { timeout: 30000 }).should('have.length', 1).first().as('dataset');

//         // Enter the dataset
//         cy.get('@dataset').find('.cell > :nth-child(1) > a').last().click();

//         // Enter the 'Gallery' tab
//         cy.get(':nth-child(5) > .style1', { timeout: 30000 }).click();
//         cy.get('.gallery-container > .description-info > p > strong', { timeout: 30000 }).should('have.text', 'Data collection:');

//         // Check for segmentation
//         cy.findGalleryCard('Segmentation', 'prev');
//         cy.get('.el-card > .el-card__body > :nth-child(1) > .details > :nth-child(1) > b').should('contain', 'Segmentation');
//         cy.get('.el-card > .el-card__body > :nth-child(1) > .details > .el-button > span').should('contain', ' View Segmentation');
//       })
//     })
//   })

//   describe('Should open scaffold through the gallery', { testIsolation: false }, function () {
//     beforeEach('Loading Anatomical Models', function () {
//       cy.visitLoadedPage('');

//       // Navigate to 'Data&Models' page
//       cy.get('.mobile-navigation > :nth-child(1) > :nth-child(1) > a').click();

//       // Go to 'Anatomical Models'
//       cy.get(':nth-child(2) > .search-tabs__button').click();
//       cy.get(':nth-child(2) > .search-tabs__button').should('have.class', 'active');

//       cy.waitForLoadingMask()

//     })

//     scaffoldDatasetCategories.forEach((category) => {

//       it(`Access scaffold ${category}`, function () {
//         // Search for scaffold related dataset
//         cy.get('.el-input__wrapper > .el-input__inner').clear();
//         cy.get('.search-text').click();
//         cy.get('.el-table__row', { timeout: 30000 }).should('have.length', 10)

//         cy.get('.el-input__wrapper > .el-input__inner').type(category);
//         cy.get('.search-text').click();

//         cy.get('.el-table__row', { timeout: 30000 }).first().as('dataset');

//         // Enter the dataset
//         cy.get('@dataset').find('.cell > :nth-child(1) > a', { timeout: 30000 }).last().click();

//         // Enter the 'Gallery' tab
//         cy.get(':nth-child(5) > .style1', { timeout: 30000 }).click();
//         cy.get('.gallery-container > .description-info > p > strong', { timeout: 30000 }).should('have.text', 'Data collection:');

//         // Check for scaffold
//         cy.findGalleryCard('Scaffold', 'prev');
//         cy.get('.el-card > .el-card__body > :nth-child(1) > .details > :nth-child(1) > b').contains('Scaffold').should('exist');
//         cy.get('.el-card > .el-card__body > :nth-child(1) > .details > .el-button > span').contains('View Scaffold').should('exist').as('scaffold');

//         // cy.get('@scaffold').first().click()
//         // Alternative solution
//         cy.url().then(($url) => {
//           const datasetId = $url.substring($url.lastIndexOf("/") + 1, $url.indexOf("?"));
//           cy.get('.dataset-information-box > :nth-child(1)').then(($version) => {
//             cy.intercept('**/query?**').as('query');
//             cy.intercept('**/dataset_info/**').as('dataset_info');
//             cy.intercept('**/datasets/**').as('datasets');

//             const version = $version.text().match(/[0-9]+/);
//             cy.visit(`/maps?type=scaffold&dataset_id=${datasetId}&dataset_version=${version}`);

//             cy.wait('@query', { timeout: 20000 });

//             // Search dataset id
//             cy.get('.search-input > .el-input__wrapper > .el-input__inner').clear();
//             cy.get('.search-input > .el-input__wrapper > .el-input__inner').type(datasetId);
//             cy.get('.header > .el-button').click();

//             cy.wait(['@dataset_info', '@datasets'], { timeout: 20000 });

//             // Check for search result and the tag 'Scaffold'
//             cy.get('.dataset-card-container > .dataset-card:visible', { timeout: 30000 }).as('datasetCards');

//             cy.get('@datasetCards').filter(`:contains(${datasetId})`).within(() => {
//               cy.get('.badges-container > .container', { timeout: 30000 }).contains(/Scaffold/i).click();

//               cy.waitForLoadingMask()

//             });

//             cy.get('@datasetCards').contains(/View Scaffold/i).click();

//             cy.waitForLoadingMask()

//             // Check for context card
//             cy.get('.context-card').should('be.visible');
//             cy.get('.context-image').should('have.attr', 'src').and('contain', datasetId);
//             cy.get('[style="margin-right: 8px;"] > .title').should('have.class', 'title');

//             cy.get('.open-tab > .el-icon').click();

//             cy.get('@datasetCards').contains(/All/i).click();

//             // cy.get('@datasetCards').contains(/View Dataset/i).click();
//             // Alternative solution
//             cy.visitLoadedPage(`/datasets/${datasetId}?type=dataset`);
//           })
//         })
//       })
//     })
//   })

//   describe('Should find data by category', { testIsolation: false }, function () {
//     beforeEach('Visit homepage', function () {
//       cy.intercept('**/query?**').as('query');
//       cy.visitLoadedPage('');
//     })

//     categories.forEach((category) => {

//       it(`Filter datasets by ${category}`, function () {
//         // Check for category exist
//         const regex = new RegExp(category, 'i')
//         cy.get('.data-wrap > .data-item > .mb-0.mt-8').contains(regex).should('exist').as('facetsCategory');
//         cy.get('@facetsCategory').click();

//         cy.wait('@query', { timeout: 20000 });

//         cy.get('.cell > :nth-child(1) > .property-table > :nth-child(1) > :nth-child(2)', { timeout: 30000 }).first().contains(regex).should('exist');

//         // Check for detail page
//         cy.get('.el-table__row', { timeout: 30000 }).first().as('dataset');
//         cy.get('@dataset').find('.cell > :nth-child(1) > a').last().click();
//         cy.contains(regex).should('have.length.above', 0);
//       })
//     })
//   })
// })