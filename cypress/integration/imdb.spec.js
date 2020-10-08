import 'cypress-wait-until';

describe('IMDB Rater', () => {
  it('Opens IMDB and rates movies from a list', () => {
    cy.visit("/");
    signIn();
    cy.readFile(Cypress.env('movie_file')).then((data) => {
      const movies = data.split('\n');
      movies.forEach(movie => rate(movie));
    });
  });

  const signIn = () => {
    cy.get('.navbar__user').click();
    cy.get('.list-group-item').first().click();

    cy.get('#ap_email').type(Cypress.env('email'));
    cy.get('#ap_password').type(Cypress.env('password'));
    cy.get('#signInSubmit').click();
  };

  const rate = (movie) => {
    cy.get(".imdb-header-search__input")
      .type(movie);

    cy.get('.react-autosuggest__suggestion').its('length').should('be.gte', 1);
    cy.waitUntil(function() {
      return cy.get('#react-autowhatever-1--item-0').should('exist');
    });

    cy.waitUntil(function() {
      return cy.get('[data-testid="search-result--const"]').should('exist');
    });
    
    cy.get('.react-autosuggest__suggestion').first()
      .click();

    cy.get('.ratingValue').get('[itemprop="ratingValue"]').invoke('text').then((text) => {
      const rating = parseInt(text);
      cy.get('.star-rating-button').click();

      const rateElement = `[title="Click to rate: ${rating}"]`;
      cy.get('.star-rating-stars').get(rateElement).first().click();
    });
  }
});