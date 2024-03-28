/**
 * The UserDefinedData attribute, allowing user-specific information to be added to a request
 * and support reporting based on these attributes.
 */
export interface UserDefinedData {
  UserData1: string
  UserData2?: string
  UserData3?: string
}

/**
 * Construct a UserDefinedData element
 */
export function withUserDefinedData(options?: UserDefinedData) {
  if (options === undefined) {
    return undefined
  }
  return {
    UserDefinedData: {
      ...options,
    },
  }
}
