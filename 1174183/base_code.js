function buildElasticQuery(conditions) {
  // Initialize the base query structure
  const query = {
    query: {
      bool: {
        must: [],
        should: [],
        must_not: []
      }
    }
  };

  // Define synonyms array
  const synonyms = [
    { name: "python", aliases: ["py", "cpython", "pytorch"] },
    { name: "typescript", aliases: ["ts", "tsx", "typed javascript"] },
    { name: "react", aliases: ["reactjs", "react.js", "react native"] },
    { name: "angular", aliases: ["angularjs", "angular.js"] }
  ];

  // Process each condition
  conditions.forEach(condition => {
    const { operator, keyword } = condition;
    
    // Find synonym group for the keyword
    const synonymGroup = synonyms.find(syn => 
      syn.name.toLowerCase() === keyword.toLowerCase() ||
      syn.aliases.some(alias => alias.toLowerCase() === keyword.toLowerCase())
    );

    let queryClause;
    
    if (synonymGroup) {
      // Create a bool query with synonyms
      queryClause = {
        bool: {
          should: [
            { match: { field: synonymGroup.name } },
            ...synonymGroup.aliases.map(alias => ({
              match: { field: alias }
            }))
          ]
        }
      };
    } else {
      // Create a simple match query
      queryClause = {
        match: { field: keyword }
      };
    }

    // Add the query clause to the appropriate operator array
    switch (operator) {
      case 'must':
        query.query.bool.must.push(queryClause);
        break;
      case 'should':
        query.query.bool.should.push(queryClause);
        break;
      case 'must_not':
        query.query.bool.must_not.push(queryClause);
        break;
    }
  });

  return query;
}

module.exports = { buildElasticQuery };