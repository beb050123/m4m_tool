/**
 * Converts XML string to JSON
 * @param xmlString The XML string to convert
 * @param countryCode Optional country code to filter or customize the conversion
 * @returns Converted JSON object
 */
export async function convertXmlToJson(xmlString: string, countryCode?: string): Promise<any> {
  // Create a new DOMParser
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, "text/xml")

  // Convert XML to JSON
  const result = xmlToJson(xmlDoc)

  // If country code is provided, you could filter or customize the result
  if (countryCode) {
    // This is just an example - in a real app, you might filter data by country
    return {
      ...result,
      metadata: {
        ...result.metadata,
        countryCode,
      },
    }
  }

  return result
}

/**
 * Helper function to recursively convert XML nodes to JSON
 */
function xmlToJson(xml: Document | Element): any {
  // Create the return object
  const obj: any = {}

  if (xml.nodeType === 1) {
    // element
    // Attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {}
      for (let i = 0; i < xml.attributes.length; i++) {
        const attribute = xml.attributes.item(i)
        if (attribute) {
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue
        }
      }
    }
  } else if (xml.nodeType === 3) {
    // text
    return xml.nodeValue?.trim()
  }

  // Process children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i)
      const nodeName = item.nodeName

      if (nodeName === "#text") {
        const text = item.nodeValue?.trim()
        if (text && text.length > 0) {
          return text
        }
        continue
      }

      if (typeof obj[nodeName] === "undefined") {
        obj[nodeName] = xmlToJson(item)
      } else {
        if (typeof obj[nodeName].push === "undefined") {
          const old = obj[nodeName]
          obj[nodeName] = [old]
        }
        obj[nodeName].push(xmlToJson(item))
      }
    }
  }

  return obj
}

