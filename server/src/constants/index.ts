import path from 'path';

/** Minimum number of characters required for a bio submission */
export const MIN_BIO_LENGTH = 10;

/** Maximum number of characters allowed for a bio submission */
export const MAX_BIO_LENGTH = 5000;

/** Maximum number of characters allowed for interests field */
export const MAX_INTERESTS_LENGTH = 1000;

/** Maximum number of match results to return */
export const MAX_RESULTS = 10;

/** Server port number — Cloud Run sets PORT env var */
export const PORT = parseInt(process.env.PORT || '3001', 10);

/** Path to sample opportunities data file */
export const SAMPLE_DATA_PATH = path.resolve(__dirname, '../../data/sample-opportunities.json');

/** Maximum request body size */
export const MAX_BODY_SIZE = '10kb';

/** Common English stopwords excluded from keyword matching */
export const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare',
  'ought', 'used', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours',
  'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he',
  'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its',
  'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what',
  'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'not',
  'no', 'nor', 'so', 'too', 'very', 'just', 'about', 'above', 'after',
  'again', 'all', 'also', 'any', 'because', 'before', 'below', 'between',
  'both', 'but', 'each', 'few', 'further', 'get', 'got', 'here', 'how',
  'if', 'into', 'more', 'most', 'new', 'now', 'only', 'other', 'out',
  'over', 'own', 'same', 'some', 'such', 'than', 'then', 'there', 'through',
  'under', 'until', 'up', 'when', 'where', 'while', 'why', 'work', 'working',
]);
