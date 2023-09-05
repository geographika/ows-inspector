## XML Parsing Notes


The following XML block throws an error "Element text content may not contain START_ELEMENT":
This is in WMS 1.0.0 - https://portal.ogc.org/files/?artifact_id=7196

<!-- An Exception element indicates which output formats are supported
for reporting problems encountered when executing a request. Available
Exception formats MUST include one or more of WMS_XML, INIMAGE, or BLANK.
19 APRIL 2000 PAGE 40
OPENGIS PROJECT DOCUMENT 00-028 OpenGIS® Web Map Server Interface Implementation Specification
Example: <Exception><Format><INIMAGE /><WMS_XML /></Format></Exception>. -->
<!ELEMENT Exception (Format)>

```xml
  <Exception>
    <Format><BLANK /><INIMAGE /><WMS_XML /></Format>
  </Exception>
```

Should be the following?


```xml
  <Exception>
    <Format>XML</Format>
    <Format>INIMAGE</Format>
    <Format>BLANK</Format>
  </Exception>
```

 GeoServer supports WMS 1.1.1, the most widely used version of WMS, as well as WMS 1.3.0.

### Test URLs

/resources/tests/xml/wms_1_0_0_GetCapabilities.xml?service=wms&request=getcapabilities&version=1.0.0
/resources/tests/xml/wms_1_1_0_GetCapabilities.xml?service=wms&request=getcapabilities&version=1.1.0
/resources/tests/xml/wms_1_1_1_GetCapabilities.xml?service=wms&request=getcapabilities&version=1.1.1
/resources/tests/xml/wms_1_3_0_GetCapabilities.xml?service=wms&request=getcapabilities&version=1.3.0
