describe('Quiz E2E Tests', () => {
  beforeEach(() => {
    // Intercept API calls and return mock data
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions')
    cy.visit('/')
  })

  it('should show start button initially', () => {
    cy.get('button').contains('Start Quiz').should('be.visible')
  })

  it('should start quiz when clicking start button', () => {
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    cy.get('h2').should('contain', 'What is Python?')
  })

  it('should show all answers for a question', () => {
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    cy.get('.alert').should('have.length', 4)
  })

  it('should complete quiz and show score', () => {
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    
    // Answer first question
    cy.get('.btn-primary').first().click()
    
    // Answer second question
    cy.get('.btn-primary').first().click()
    
    // Check if quiz completed screen is shown
    cy.get('h2').should('contain', 'Quiz Completed')
    cy.get('.alert-success').should('contain', 'Your score:')
  })
})
