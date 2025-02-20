const { MovieRentingSystem } = require('./solution'); 

describe('MovieRentingSystem', () => {
    let system;

    beforeEach(() => {
        system = new MovieRentingSystem(3, [
            [0, 1, 5],
            [0, 2, 6],
            [1, 1, 4],
            [1, 2, 7],
            [2, 1, 5],
            [2, 2, 8],
        ]);
    });

    test('search should return top 5 cheapest shops for a movie', () => {
        expect(system.search(1)).toEqual([1, 0, 2]); 
        expect(system.search(2)).toEqual([0, 1, 2]); 
    });

    test('search should return an empty list for a non-existent movie', () => {
        expect(system.search(3)).toEqual([]);
    });

    test('rent should move movie from available list to rented list', () => {
        system.rent(0, 1);
        expect(system.search(1)).toEqual([1, 2]); 
        expect(system.getRentedMovies()).toEqual([[0, 1]]); 
    });

    test('renting an already rented movie should have no effect', () => {
        system.rent(0, 1);
        system.rent(0, 1); 
        expect(system.search(1)).toEqual([1, 2]);
        expect(system.getRentedMovies()).toEqual([[0, 1]]); 
    });

    test('renting a non-existent movie should have no effect', () => {
        system.rent(0, 3); 
        expect(system.search(3)).toEqual([]); 
        expect(system.getRentedMovies()).toEqual([]); 
    });

    test('return should move movie from rented list back to available', () => {
        system.rent(0, 1);
        system.returnMovie(0, 1);
        expect(system.search(1)).toEqual([1, 0, 2]); 
        expect(system.getRentedMovies()).toEqual([]); 
    });

    test('returning an already returned movie should have no effect', () => {
        system.rent(0, 1);
        system.returnMovie(0, 1);
        system.returnMovie(0, 1); 
        expect(system.search(1)).toEqual([1, 0, 2]); 
        expect(system.getRentedMovies()).toEqual([]); 
    });

    test('returning a non-existent movie should have no effect', () => {
        system.returnMovie(0, 3); 
        expect(system.search(3)).toEqual([]);
        expect(system.getRentedMovies()).toEqual([]); 
    });

    test('getRentedMovies should return an empty list when no movies are rented', () => {
        expect(system.getRentedMovies()).toEqual([]);
    });

    test('getRentedMovies should return top 5 rented movies sorted by price, shop, and movie', () => {
        system.rent(0, 1); 
        system.rent(1, 2);
        system.rent(2, 1); 
        expect(system.getRentedMovies()).toEqual([
            [0, 1], 
            [2, 1], 
            [1, 2],
        ]);
    });

    test('getRentedMovies should return at most 5 movies', () => {
        system = new MovieRentingSystem(10, [
            [0, 1, 5],
            [1, 1, 4],
            [2, 1, 6],
            [3, 1, 3],
            [4, 1, 7],
            [5, 1, 2],
            [6, 1, 8],
        ]);

        system.rent(0, 1);
        system.rent(1, 1);
        system.rent(2, 1);
        system.rent(3, 1);
        system.rent(4, 1);
        system.rent(5, 1);
        system.rent(6, 1);

        expect(system.getRentedMovies()).toEqual([
            [5, 1], 
            [3, 1],
            [1, 1], 
            [0, 1], 
            [2, 1], 
        ]);
    });

    test('should handle initialization with no entries', () => {
        system = new MovieRentingSystem(0, []);
        expect(system.search(1)).toEqual([]);
        expect(system.getRentedMovies()).toEqual([]);
    });

    test('should handle renting and returning all movies', () => {
        system.rent(0, 1);
        system.rent(1, 1);
        system.rent(2, 1);
        system.returnMovie(0, 1);
        system.returnMovie(1, 1);
        system.returnMovie(2, 1);
        expect(system.search(1)).toEqual([1, 0, 2]); 
        expect(system.getRentedMovies()).toEqual([]); 
    });

    test('renting from a non-existent shop should have no effect', () => {
        system.rent(3, 1); 
        expect(system.search(1)).toEqual([1, 0, 2]);
        expect(system.getRentedMovies()).toEqual([]); 
    });

    test('returning to a non-existent shop should have no effect', () => {
        system.returnMovie(3, 1);
        expect(system.search(1)).toEqual([1, 0, 2]); 
        expect(system.getRentedMovies()).toEqual([]); 
    });
    test("should create a new heap if movie is missing in availableMovies when returned", () => {
      const system = new MovieRentingSystem(3, [
          [0, 1, 5], 
          [1, 1, 4], 
      ]);
  
      system.rent(0, 1);
      system.rent(1, 1);
  
      delete system.availableMovies[1];
  
      system.returnMovie(0, 1);
  
      expect(system.availableMovies[1]).toBeDefined();
      expect(system.availableMovies[1].size).toBe(1);
      expect(system.availableMovies[1].peek()).toEqual([5, 0]);
  });

  test("should create a new heap if movie is missing in availableMovies when returned", () => {
    const system = new MovieRentingSystem(3, [
        [0, 1, 5], 
        [1, 1, 4], 
        [2, 1, 5],
    ]);

    system.rent(0, 1);
    system.rent(1, 1);
    system.rent(2, 1);

    delete system.availableMovies[1];

    system.returnMovie(0, 1); 
    system.returnMovie(1, 1); 
    system.returnMovie(2, 1); 

    expect(system.availableMovies[1]).toBeDefined();
    expect(system.availableMovies[1].size).toBe(3);

    const first = system.availableMovies[1].remove();
    const second = system.availableMovies[1].remove();
    const third = system.availableMovies[1].remove();

    expect(first).toEqual([4, 1]);  
    expect(second).toEqual([5, 0]); 
    expect(third).toEqual([5, 2]);  
});
});