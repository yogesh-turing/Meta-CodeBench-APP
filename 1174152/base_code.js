const crypto = require('crypto');

class CarRentalService {
    constructor(databaseConnection) {
        this.db = databaseConnection;
    }

    async searchCars(location, startDate, endDate) {
        try {
            return await this.db.query('SELECT * FROM cars WHERE location = ? AND availableDate BETWEEN ? AND ?', [location, startDate, endDate]);
        } catch (error) {
            console.error('Error searching for cars:', error);
            return [];
        }
    }

    async bookCar(userId, carId, rentalPeriod) {
        try {
            const bookingId = crypto.randomBytes(16).toString('hex');
            const result = await this.db.execute('INSERT INTO bookings (bookingId, userId, carId, period) VALUES (?, ?, ?, ?)', [bookingId, userId, carId, rentalPeriod]);
            return result;
        } catch (error) {
            console.error('Error booking car:', error);
            return null;
        }
    }

    async cancelBooking(userId, bookingId) {
        try {
            await this.db.execute('DELETE FROM bookings WHERE bookingId = ? AND userId = ?', [bookingId, userId]);
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    }

    async getCarDetails(carId) {
        try {
            const car = await this.db.query('SELECT * FROM cars WHERE carId = ?', [carId]);
            return car.length ? car[0] : null;
        } catch (error) {
            console.error('Error retrieving car details:', error);
            throw error;
        }
    }

    async filterCarsByType(type) {
        try {
            return await this.db.query('SELECT * FROM cars WHERE type = ?', [type]);
        } catch (error) {
            console.error('Error filtering cars by type:', error);
            throw error;
        }
    }

    async calculateRentalCost(carId, rentalPeriod) {
        try {
            const carDetails = await this.getCarDetails(carId);
            if (!carDetails) {
                throw new Error("Car not found");
            }
            const baseRate = this.determineBaseRate(carDetails.type, new Date());
            return baseRate * rentalPeriod;
        } catch (error) {
            console.error('Error calculating rental cost:', error);
            throw error;
        }
    }

    determineBaseRate(carType, date) {
        const month = date.getMonth() + 1;
        let seasonalMultiplier = 1;
        if ([6, 7, 8].includes(month)) { 
            seasonalMultiplier = 1.2;
        } else if ([11, 12, 1].includes(month)) {
            seasonalMultiplier = 1.1;
        }
        const typeRates = {
            economy: 50,
            standard: 70,
            luxury: 100
        };
        return (typeRates[carType] || 50) * seasonalMultiplier;
    }

    async addInsurance(userId, bookingId, insuranceType) {
        try {
            await this.db.execute('UPDATE bookings SET insuranceType = ? WHERE bookingId = ? AND userId = ?', [insuranceType, bookingId, userId]);
        } catch (error) {
            console.error('Error adding insurance:', error);
        }
    }

    async getAvailableCars(location, date) {
        try {
            return await this.db.query('SELECT * FROM cars WHERE location = ? AND availableDate = ?', [location, date]);
        } catch (error) {
            console.error('Error getting available cars:', error);
            throw error;
        }
    }

    async trackRentalHistory(userId) {
        try {
            return await this.db.query('SELECT * FROM bookings WHERE userId = ?', [userId]);
        } catch (error) {
            console.error('Error tracking rental history:', error);
            throw error;
        }
    }

    async rateRentalExperience(userId, bookingId, rating) {
        try {
            await this.db.execute('UPDATE bookings SET rating = ? WHERE bookingId = ? AND userId = ?', [rating, bookingId, userId]);
        } catch (error) {
            console.error('Error rating rental experience:', error);
            throw error;
        }
    }
}

module.exports = { CarRentalService };