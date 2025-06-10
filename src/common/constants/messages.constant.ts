// App-wide messages organized by module and type
export const MESSAGES = {
  // Auth Module Messages
  AUTH: {
    SUCCESS: {
      VERIFIED: 'Wallet signature verified successfully',
      REGISTERED: 'User registered successfully',
    },
    ERROR: {
      INVALID_SIGNATURE: 'Invalid wallet signature',
      INVALID_MESSAGE: 'Invalid message format',
      WALLET_REQUIRED: 'Wallet address is required',
      SIGNATURE_REQUIRED: 'Signature is required',
      MESSAGE_REQUIRED: 'Message is required',
    }
  },

  // User Module Messages
  USER: {
    SUCCESS: {
      PROFILE_UPDATED: 'User profile updated successfully',
      PROFILE_CREATED: 'User profile created successfully',
    },
    ERROR: {
      NOT_FOUND: 'User not found',
      UPDATE_FAILED: 'Failed to update user profile',
      CREATE_FAILED: 'Failed to create user profile',
      USERNAME_TAKEN: 'Username is already taken',
      INVALID_USERNAME: 'Invalid username format',
      INVALID_BIO: 'Bio is too long',
      INVALID_PROFILE_PIC: 'Invalid profile picture URL',
    }
  },

  // Post Module Messages
  POST: {
    SUCCESS: {
      CREATED: 'Post created successfully',
      DELETED: 'Post deleted successfully',
      LIKED: 'Post liked successfully',
      UNLIKED: 'Post unliked successfully',
      COMMENT_ADDED: 'Comment added successfully',
      COMMENT_DELETED: 'Comment deleted successfully',
    },
    ERROR: {
      NOT_FOUND: 'Post not found',
      CONTENT_REQUIRED: 'Post content is required',
      CONTENT_LENGTH: 'Post content must be between 1 and 500 characters',
      INVALID_POST_ID: 'Invalid post ID',
      LIKE_FAILED: 'Failed to like post',
      UNLIKE_FAILED: 'Failed to unlike post',
      COMMENT_FAILED: 'Failed to add comment',
      DELETE_FAILED: 'Failed to delete post',
      UPDATE_FAILED: 'Failed to update post',
      UNAUTHORIZED: 'You are not authorized to perform this action',
      CREATE_FAILED: 'Failed to create post',
      ALREADY_LIKED: 'You have already liked this post',
      NOT_LIKED: 'You have not liked this post',
    }
  },

  // Comment Module Messages
  COMMENT: {
    SUCCESS: {
      CREATED: 'Comment created successfully.',
      UPDATED: 'Comment updated successfully.',
      DELETED: 'Comment deleted successfully.',
      RETRIEVED: 'Comment retrieved successfully.',
    },
    ERROR: {
      NOT_FOUND: 'Comment not found.',
      CONTENT_REQUIRED: 'Comment content is required.',
      CONTENT_LENGTH: 'Comment content must be between 1 and 500 characters.',
      INVALID_COMMENT_ID: 'Invalid comment ID.',
      CREATE_FAILED: 'Failed to create comment.',
      UPDATE_FAILED: 'Failed to update comment.',
      DELETE_FAILED: 'Failed to delete comment.',
      UNAUTHORIZED: 'You are not authorized to perform this action.',
    }
  },

  // General System Messages
  SYSTEM: {
    SUCCESS: {
      OPERATION_SUCCESSFUL: 'Operation completed successfully.',
      DATA_RETRIEVED: 'Data retrieved successfully.',
    },
    ERROR: {
      INTERNAL_SERVER_ERROR: 'Internal server error occurred.',
      DATABASE_ERROR: 'Database operation failed.',
      VALIDATION_ERROR: 'Validation failed.',
      UNAUTHORIZED: 'Unauthorized access.',
      FORBIDDEN: 'Access forbidden.',
      NOT_FOUND: 'Resource not found.',
      BAD_REQUEST: 'Bad request.',
      RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
      SERVICE_UNAVAILABLE: 'Service temporarily unavailable.',
    }
  },

  // Validation Messages
  VALIDATION: {
    ERROR: {
      REQUIRED_FIELD: 'This field is required.',
      INVALID_EMAIL: 'Invalid email format.',
      INVALID_URL: 'Invalid URL format.',
      INVALID_DATE: 'Invalid date format.',
      INVALID_NUMBER: 'Invalid number format.',
      INVALID_BOOLEAN: 'Invalid boolean value.',
      INVALID_ENUM: 'Invalid enum value.',
      INVALID_UUID: 'Invalid UUID format.',
      INVALID_ETH_ADDRESS: 'Invalid Ethereum address format.',
      INVALID_SIGNATURE: 'Invalid signature format.',
      STRING_LENGTH: 'Length must be between {min} and {max} characters.',
      NUMBER_RANGE: 'Value must be between {min} and {max}.',
      ARRAY_MIN_LENGTH: 'Array must contain at least {min} items.',
      ARRAY_MAX_LENGTH: 'Array must not contain more than {max} items.',
    }
  }
};
