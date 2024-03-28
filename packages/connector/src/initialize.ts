import { initializeConfig, Config } from './config'
import { initializeConnector } from './raft-connector'

/**
 * Initialize the connector with the given configuration
 * @param config The configuration holding secrets and configuration for the RAFT connector
 */
export function initialize(config: Config, requiresCommercetoolsAccess: boolean) {
  initializeConfig(config, requiresCommercetoolsAccess)
  initializeConnector()
}
