package com.icfolson.aem.auth0service.components.cloudservices.auth0authentication;

import com.citytechinc.cq.component.annotations.Component;
import com.citytechinc.cq.component.annotations.ContentProperty;
import com.day.cq.wcm.webservicesupport.Configuration;
import com.day.cq.wcm.webservicesupport.ConfigurationManager;
import com.google.common.base.Predicate;
import com.icfolson.aem.auth0service.components.page.auth0authentication.Auth0AuthenticationPage;
import com.icfolson.aem.library.api.page.PageDecorator;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Component(value = "Auth0 Authentication",
        group = ".hidden",
        path = "/cloudservices",
        name = "auth0-authentication",
        contentAdditionalProperties = @ContentProperty(name = "requiredClientLibraryCategories", value = "auth0-cloudservices.app"))
@Model(adaptables = Resource.class)
public class Auth0Authentication {

    @Inject
    private PageDecorator currentPage;

    @Inject
    private ConfigurationManager configurationManager;

    private Configuration configuration;

    private PageDecorator configuredPage;

    public String getClientId() {
        if (isHasConfiguration()) {
            return getConfiguration().get("clientId", "");
        }

        return "no config";
    }

    public String getDomain() {
        if (isHasConfiguration()) {
            return getConfiguration().get("domain", "");
        }

        return "no config";
    }

    public PageDecorator getConfiguredPage() {
        //TODO: Optimize so this is used throughout
        return currentPage.findAncestor(new IsConfiguredPagePredicate(configurationManager), false).orNull();
    }

    private Configuration getConfiguration() {
        if (configuration == null) {
            String[] services = currentPage.getInherited("cq:cloudserviceconfigs", new String[]{});

            configuration = configurationManager.getConfiguration(Auth0AuthenticationPage.CLOUD_SERVICE_NAME, services);
        }

        return configuration;
    }

    private boolean isHasConfiguration() {
        return getConfiguration() != null;
    }

    private static class IsConfiguredPagePredicate implements Predicate<PageDecorator> {

        private final ConfigurationManager configurationManager;

        IsConfiguredPagePredicate(ConfigurationManager configurationManager) {
            this.configurationManager = configurationManager;
        }

        @Override
        public boolean apply(PageDecorator currentPage) {
            String[] services = currentPage.get("cq:cloudserviceconfigs", new String[]{});

            Configuration configuration = configurationManager.getConfiguration(Auth0AuthenticationPage.CLOUD_SERVICE_NAME, services);

            return configuration != null;
        }

    }

}
