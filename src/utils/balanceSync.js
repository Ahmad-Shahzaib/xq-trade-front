import { apiBaseUrl1 } from './config';

/**
 * Utility functions for wallet balance synchronization and validation
 */

/**
 * Fetch the latest balance from the server
 * @param {string} accountId - The account ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Promise resolving to balance data
 */
export const fetchLatestBalance = async (accountId, token) => {
  try {
    const response = await fetch(`${apiBaseUrl1}/trade-accounts/${accountId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch latest balance:', error);
    throw error;
  }
};

/**
 * Validate balance data received from Pusher
 * @param {Object} data - Data received from Pusher
 * @returns {boolean} - Whether the data is valid
 */
export const validatePusherBalanceData = (data) => {
  if (!data || typeof data !== 'object') {
    console.error('❌ Invalid Pusher data structure:', data);
    return false;
  }

  if (!data.balance || isNaN(parseFloat(data.balance))) {
    console.error('❌ Invalid balance in Pusher data:', data.balance);
    return false;
  }

  if (!data.account_id) {
    console.error('❌ Missing account_id in Pusher data:', data);
    return false;
  }

  if (!data.order || !data.order.id) {
    console.error('❌ Missing order data in Pusher data:', data);
    return false;
  }

  return true;
};

/**
 * Calculate expected balance after a trade
 * @param {number} currentBalance - Current balance
 * @param {number} stake - Trade stake amount
 * @param {string} result - Trade result ('win' or 'loss')
 * @param {number} payout - Payout amount (for wins)
 * @returns {number} - Expected new balance
 */
export const calculateExpectedBalance = (currentBalance, stake, result, payout = 0) => {
  if (result === 'win') {
    return currentBalance + payout;
  } else if (result === 'loss') {
    return currentBalance; // Balance was already deducted when trade was placed
  }
  return currentBalance;
};

/**
 * Check if balance update is reasonable
 * @param {number} oldBalance - Previous balance
 * @param {number} newBalance - New balance
 * @param {number} stake - Trade stake
 * @param {string} result - Trade result
 * @param {number} payout - Payout amount
 * @returns {Object} - Validation result
 */
export const validateBalanceUpdate = (oldBalance, newBalance, stake, result, payout = 0) => {
  const expectedBalance = calculateExpectedBalance(oldBalance, stake, result, payout);
  const difference = Math.abs(newBalance - expectedBalance);
  const tolerance = 0.01; // Allow for small rounding differences

  return {
    isValid: difference <= tolerance,
    expectedBalance,
    actualBalance: newBalance,
    difference,
    tolerance
  };
};

/**
 * Format balance for display
 * @param {number} balance - Balance amount
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted balance string
 */
export const formatBalance = (balance, decimals = 2) => {
  if (balance === null || balance === undefined || isNaN(balance)) {
    return '$0.00';
  }
  return `$${parseFloat(balance).toFixed(decimals)}`;
};

/**
 * Log balance update for debugging
 * @param {Object} updateData - Balance update data
 */
export const logBalanceUpdate = (updateData) => {
  const {
    type,
    oldBalance,
    newBalance,
    amount,
    tradeId,
    orderResult,
    timestamp = new Date().toISOString()
  } = updateData;

  console.log('💰 Balance Update:', {
    timestamp,
    type,
    oldBalance: formatBalance(oldBalance),
    newBalance: formatBalance(newBalance),
    difference: formatBalance(newBalance - oldBalance),
    amount: amount ? formatBalance(amount) : 'N/A',
    tradeId: tradeId || 'N/A',
    result: orderResult || 'N/A'
  });
};

/**
 * Get balance update summary
 * @param {Array} balanceHistory - Array of balance updates
 * @returns {Object} - Summary statistics
 */
export const getBalanceUpdateSummary = (balanceHistory) => {
  if (!balanceHistory || balanceHistory.length === 0) {
    return {
      totalUpdates: 0,
      totalProfit: 0,
      totalLoss: 0,
      winCount: 0,
      lossCount: 0,
      averageUpdate: 0
    };
  }

  const summary = balanceHistory.reduce((acc, update) => {
    acc.totalUpdates++;
    
    if (update.difference) {
      if (update.difference > 0) {
        acc.totalProfit += update.difference;
        acc.winCount++;
      } else {
        acc.totalLoss += Math.abs(update.difference);
        acc.lossCount++;
      }
    }
    
    return acc;
  }, {
    totalUpdates: 0,
    totalProfit: 0,
    totalLoss: 0,
    winCount: 0,
    lossCount: 0
  });

  summary.averageUpdate = summary.totalUpdates > 0 
    ? (summary.totalProfit - summary.totalLoss) / summary.totalUpdates 
    : 0;

  return summary;
};

/**
 * Debounce function for balance updates
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Retry function for failed operations
 * @param {Function} operation - Operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} - Promise that resolves with operation result
 */
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};
