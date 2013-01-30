/// <reference path="data.js" />

(function (lightSwitchApplication) {

    msls._addEntryPoints(lightSwitchApplication.Person, {
        /// <field>
        /// Called when a new person is created.
        /// <br/>created(msls.application.Person entity)
        /// </field>
        created: [lightSwitchApplication.Person]
    });

    msls._addEntryPoints(lightSwitchApplication.Labs, {
        /// <field>
        /// Called when a new labs is created.
        /// <br/>created(msls.application.Labs entity)
        /// </field>
        created: [lightSwitchApplication.Labs]
    });

}(msls.application));
