// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  if (err.message.includes('Avoided redundant navigation to current location'))
    return false
  if (err.message.includes('Maximum iterations reached.'))
    return false
  if (err.message.includes('ResizeObserver loop limit exceeded'))
    return false
  if (err.message.includes('config is not defined'))
    return false
  if (err.message.includes('ResizeObserver loop completed with undelivered notifications'))
    return false
  if (err.message.includes('path.dirname is not a function'))
    return false
  if (err.message.includes("Cannot destructure property 'type' of 'vnode' as it is null"))
    return false
  if (err.message.includes('Cannot read properties of undefined'))
    return false
  if (err.message.includes('Source "markers" already exists.'))
    return false
  if (err.message.includes('node already exist in the graph')) {
    return false
  }
  // // For legacy dataset
  // if (err.message.includes('ObjectID does not exist'))
  //   return false
  return true
})

Cypress.Commands.add('waitForLoadingMask', () => {
  cy.get('.multi-container > .el-loading-parent--relative > .el-loading-mask', { timeout: 30000 }).should('not.exist')

  cy.wait(5000)

})

Cypress.Commands.add('visitLoadedPage', (url) => {
  cy.visit(url)

  cy.waitForLoadingMask()

})

Cypress.Commands.add('findGalleryCard', (text, dir) => {
  let direction = '.btn-next'
  const clickNextPageButton = () => {
    cy.get('.el-card > .el-card__body').then(($card) => {
      if (!$card.text().includes(text)) {
        cy.get(direction).then(($button) => {
          if ($button.is(":disabled")) {
            return
          } else {
            cy.wrap($button).click()
            clickNextPageButton()
          }
        })
      }
    })
  }
  if (dir === 'prev') {
    cy.get('.el-pager > .number').last().click()
    direction = '.btn-prev'
  }
  clickNextPageButton()
})

Cypress.Commands.add('clickOnNeuron', (coordinate, pixel) => {
  let coorX = coordinate.x
  let coorY = coordinate.y
  const clickOnNeuron = () => {
    cy.get('@canvas').click(coorX, coorY)

    cy.wait(5000)

    cy.get('body').then(($body) => {
      if ($body.find('.sidebar-container > .tab-container').length === 0) {
        coorX -= pixel
        clickOnNeuron()
      }
    })
  }
  clickOnNeuron()
})

Cypress.Commands.add('filterCheckbox', (factArray, action, checkbox) => {
  factArray.forEach((facet) => {
    // Check the matched facet checkbox
    cy.wrap(checkbox).contains(new RegExp(`^${facet}$`, 'i')).then(($label) => {
      cy.wrap($label).parent().siblings('.el-checkbox').then(($checkbox) => {
        const isChecked = $checkbox.hasClass('is-checked')
        const isIndeterminate = $checkbox.children().hasClass('is-indeterminate')
        if (action === 'check' && !isChecked) {
          cy.wrap($label).click()
        } else if (action === 'uncheck' && (isChecked || isIndeterminate)) {
          cy.wrap($label).click() // If isIndeterminate after this click checkbox will turn to isChecked
          if (isIndeterminate) {
            cy.wrap($label).click() // One more click to uncheck
          }
        }
      })
    })
  })
})

Cypress.Commands.add('checkFilterCleared', () => {
  cy.get('.el-card__body > .capitalize').should('not.exist')
  cy.get('.no-facets').should('contain', 'No filters applied')
  cy.url().should('not.contain', 'selectedFacetIds')
})