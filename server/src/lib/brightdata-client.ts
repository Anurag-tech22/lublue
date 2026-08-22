import https from 'https';
import http from 'http';

/** Configuration for the Bright Data API client */
interface BrightDataClientConfig {
  /** API key for authentication */
  apiKey: string;
  /** Collector ID for the scraping job */
  collectorId: string;
  /** Base URL for the Bright Data API */
  baseUrl?: string;
}

/** Response from a Bright Data collector trigger */
interface TriggerResponse {
  /** Snapshot ID for retrieving results */
  snapshot_id: string;
  /** Status of the trigger request */
  status: string;
}

/**
 * HTTP client wrapper for the Bright Data Data Collector API.
 * Encapsulates all HTTP communication so the rest of the app
 * never touches networking details directly.
 */
export class BrightDataClient {
  private readonly apiKey: string;
  private readonly collectorId: string;
  private readonly baseUrl: string;

  /**
   * Creates a new Bright Data API client.
   * @param config - Client configuration including API key and collector ID
   */
  constructor(config: BrightDataClientConfig) {
    this.apiKey = config.apiKey;
    this.collectorId = config.collectorId;
    this.baseUrl = config.baseUrl ?? 'https://api.brightdata.com';
  }

  /**
   * Triggers a Data Collector scraping job.
   * Sends a POST request to /dca/trigger with the collector ID and
   * any input parameters needed for the scraping job.
   * @param inputs - Key-value input parameters for the collector
   * @returns The trigger response containing a snapshot ID
   */
  async trigger(inputs: Record<string, string> = {}): Promise<TriggerResponse> {
    const url = `${this.baseUrl}/dca/trigger?collector=${this.collectorId}`;
    const body = JSON.stringify(inputs);

    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const transport = parsedUrl.protocol === 'https:' ? https : http;

      const req = transport.request(
        {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port,
          path: `${parsedUrl.pathname}${parsedUrl.search}`,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk: Buffer) => {
            data += chunk.toString();
          });
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                resolve(JSON.parse(data) as TriggerResponse);
              } catch {
                reject(new Error(`Failed to parse Bright Data response: ${data}`));
              }
            } else {
              reject(new Error(`Bright Data API error (${res.statusCode ?? 'unknown'}): ${data}`));
            }
          });
        },
      );

      req.on('error', (err: Error) => {
        reject(new Error(`Bright Data request failed: ${err.message}`));
      });

      req.write(body);
      req.end();
    });
  }
}
