// Refactored processData function
async function processData(data) {
  try {
    const processItem = async (item) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (item.status === 'success') {
            resolve(item.value);
          } else {
            reject(new Error(`Error processing item: ${item.id}`));
          }
        }, 1000);
      });
    };

    const processItems = async (items) => {
      const results = await Promise.allSettled(items.map(processItem));
      return results.filter((result) => result.status === 'fulfilled').map((result) => result.value);
    };

    return await processItems(data);

  } catch (error) {
    console.error('Error processing data:', error);
    throw error; 
  }
}

// Example usage
processData([
  { id: 1, status: 'success', value: 'value1' },
  { id: 2, status: 'failed', value: 'value2' },
  { id: 3, status: 'success', value: 'value3' },
])
  .then((successfulValues) => {
    console.log('Successful values:', successfulValues); 
  })
  .catch((error) => {
    console.error('Error:', error);
  });