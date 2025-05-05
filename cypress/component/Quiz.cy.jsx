import React from 'react'
import { mount } from '@cypress/react18'
import { BrowserRouter } from 'react-router-dom'
import Quiz from '../../client/src/components/Quiz'

describe('Quiz Component Tests', () => {
  const TestWrapper = ({ children }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )

  beforeEach(() => {
    cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions')
  })

  it('mounts successfully', () => {
    cy.mount(
      <TestWrapper>
        <Quiz />
      </TestWrapper>
    )
    cy.get('button').contains('Start Quiz').should('be.visible')
  })

  it('displays questions and answers correctly', () => {
    cy.mount(
      <TestWrapper>
        <Quiz />
      </TestWrapper>
    )
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')
    
    cy.get('h2').should('contain', 'What is Python?')
    cy.get('.alert').should('have.length', 4)
    cy.get('.alert').first().should('contain', 'A programming language')
  })

  it('tracks score correctly', () => {
    cy.mount(
      <TestWrapper>
        <Quiz />
      </TestWrapper>
    )
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')

    // Click correct answer (first answer is correct in mock data)
    cy.get('.btn-primary').first().click()
    
    // Answer second question
    cy.get('.btn-primary').first().click()
    
    // Check final score
    cy.get('.alert-success').should('contain', '1/2')
  })

  it('allows starting a new quiz after completion', () => {
    cy.mount(
      <TestWrapper>
        <Quiz />
      </TestWrapper>
    )
    cy.get('button').contains('Start Quiz').click()
    cy.wait('@getQuestions')

    // Complete quiz
    cy.get('.btn-primary').first().click()
    cy.get('.btn-primary').first().click()

    // Start new quiz
    cy.get('button').contains('Take New Quiz').click()
    cy.wait('@getQuestions')
    cy.get('h2').should('contain', 'What is Python?')
  })
})
