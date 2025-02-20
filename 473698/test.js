const {SubscriptionManager} = require('./solution');

describe('SubscriptionManager', () => {
  
  test('Handles different billing cycles correctly', () => {
    const subscriptions = [
      { price: 10, billingCycle: 'monthly', currency: 'USD' },
      { price: 120, billingCycle: 'yearly', currency: 'USD' },
      { price: 300, billingCycle: 'lifetime', currency: 'USD' }
    ];
    const manager = new SubscriptionManager(subscriptions);
    expect(manager.calculateRevenue({ USD: 1 })).toEqual(320);
  });

  test('Applies yearly subscription discounts correctly', () => {
    const subscriptions = [
      { price: 120, billingCycle: 'yearly', currency: 'USD', discount: 15 }
    ];
    const manager = new SubscriptionManager(subscriptions);
    expect(manager.calculateRevenue({ USD: 1 })).toEqual(8.5); 
  });

  test('Converts revenue to base currency using exchange rates', () => {
    const subscriptions = [
      { price: 100, billingCycle: 'yearly', currency: 'EUR' }
    ];
    const manager = new SubscriptionManager(subscriptions);
    const result = manager.calculateRevenue({ EUR: 1.1, USD: 1 });

    expect(parseFloat(result.toFixed(2))).toEqual(parseFloat((110 / 12).toFixed(2)));
});


  test('Throws an error for unsupported currencies', () => {
    const subscriptions = [
      { price: 100, billingCycle: 'yearly', currency: 'GBP' }
    ];
    const manager = new SubscriptionManager(subscriptions);
    expect(() => manager.calculateRevenue({ EUR: 1.1, USD: 1 })).toThrow("Unsupported currency");
  });

  test('Handles cancellations with prorated refunds for yearly subscriptions', () => {
    const subscriptions = [
      { price: 120, billingCycle: 'yearly', currency: 'USD', cancelAfterMonths: 6 }
    ];
    const manager = new SubscriptionManager(subscriptions);
    expect(manager.calculateRevenue({ USD: 1 })).toEqual(5); 
  });

  test('Ensures monthly subscriptions do not contribute after cancellation', () => {
    const subscriptions = [
      { price: 10, billingCycle: 'monthly', currency: 'USD', cancelAfterMonths: 1 }
    ];
    const manager = new SubscriptionManager(subscriptions);
    expect(manager.calculateRevenue({ USD: 1 })).toEqual(10); 
  });

  test('Lifetime subscriptions remain unaffected by cancellations', () => {
    const subscriptions = [
      { price: 250, billingCycle: 'lifetime', currency: 'USD', cancelAfterMonths: 6 }
    ];
    const manager = new SubscriptionManager(subscriptions);
    expect(manager.calculateRevenue({ USD: 1 })).toEqual(250);
  });

  test('Ignores invalid prices such as null, undefined, NaN, or non-numeric values', () => {
    const subscriptions = [
      { price: null, billingCycle: 'monthly', currency: 'USD' },
      { price: undefined, billingCycle: 'yearly', currency: 'USD' },
      { price: NaN, billingCycle: 'yearly', currency: 'USD' },
      { price: "invalid", billingCycle: 'monthly', currency: 'USD' },
      { price: 50, billingCycle: 'lifetime', currency: 'USD' }
    ];
    const manager = new SubscriptionManager(subscriptions);
    expect(manager.calculateRevenue({ USD: 1 })).toEqual(50); 
  });

  test('Caches results to optimize performance', () => {
    const subscriptions = [
      { price: 100, billingCycle: 'monthly', currency: 'USD' }
    ];
    const manager = new SubscriptionManager(subscriptions);
    const firstRun = manager.calculateRevenue({ USD: 1 });
    const secondRun = manager.calculateRevenue({ USD: 1 });
    expect(firstRun).toBe(secondRun); 
  });
});