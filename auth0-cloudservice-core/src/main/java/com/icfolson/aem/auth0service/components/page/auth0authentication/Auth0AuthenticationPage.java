package com.icfolson.aem.auth0service.components.page.auth0authentication;

import com.citytechinc.cq.component.annotations.Component;
import com.citytechinc.cq.component.annotations.ContentProperty;
import com.citytechinc.cq.component.annotations.DialogField;
import com.citytechinc.cq.component.annotations.widgets.TextField;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

import javax.inject.Inject;

@Component(
        value = "Auth0 Authentication Page",
        group = ".hidden",
        path = "/page",
        name = "auth0-authentication-page",
        resourceSuperType = "cq/cloudserviceconfigs/components/configpage",
        contentAdditionalProperties = @ContentProperty( namespace = "cq", name = "defaultView", value = "html" )
)
@Model(adaptables = Resource.class)
public class Auth0AuthenticationPage {

    public static final String CLOUD_SERVICE_NAME = "auth0-cloudservice";

    @DialogField(fieldLabel = "ClientId", required = true) @TextField
    @Inject @Optional
    private String clientId;

    @DialogField(fieldLabel = "Domain", required = true) @TextField
    @Inject @Optional
    private String domain;

    public String getClientId() {
        return clientId;
    }

    public String getDomain() {
        return domain;
    }

}
