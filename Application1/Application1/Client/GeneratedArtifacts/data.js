/// <reference path="../Scripts/msls-1.0.0.js" />

window.myapp = msls.application;

(function (lightSwitchApplication) {

    var $Entity = msls.Entity,
        $DataService = msls.DataService,
        $DataWorkspace = msls.DataWorkspace,
        $defineEntity = msls._defineEntity,
        $defineDataService = msls._defineDataService,
        $defineDataWorkspace = msls._defineDataWorkspace,
        $DataServiceQuery = msls.DataServiceQuery,
        $toODataString = msls._toODataString;

    function Person(entitySet) {
        /// <summary>
        /// Represents the Person entity type.
        /// </summary>
        /// <param name="entitySet" type="msls.EntitySet" optional="true">
        /// The entity set that should contain this person.
        /// </param>
        /// <field name="Id" type="Number">
        /// Gets or sets the id for this person.
        /// </field>
        /// <field name="RowVersion" type="Array">
        /// Gets or sets the rowVersion for this person.
        /// </field>
        /// <field name="Name" type="String">
        /// Gets or sets the name for this person.
        /// </field>
        /// <field name="SSN" type="String">
        /// Gets or sets the sSN for this person.
        /// </field>
        /// <field name="DOB" type="Date">
        /// Gets or sets the dOB for this person.
        /// </field>
        /// <field name="LabsCollection" type="msls.EntityCollection">
        /// Gets the labsCollection for this person.
        /// </field>
        /// <field name="details" type="msls.application.Person.Details">
        /// Gets the details for this person.
        /// </field>
        $Entity.call(this, entitySet);
    }

    function Labs(entitySet) {
        /// <summary>
        /// Represents the Labs entity type.
        /// </summary>
        /// <param name="entitySet" type="msls.EntitySet" optional="true">
        /// The entity set that should contain this labs.
        /// </param>
        /// <field name="Id" type="Number">
        /// Gets or sets the id for this labs.
        /// </field>
        /// <field name="RowVersion" type="Array">
        /// Gets or sets the rowVersion for this labs.
        /// </field>
        /// <field name="LabDate" type="Date">
        /// Gets or sets the labDate for this labs.
        /// </field>
        /// <field name="Fingers" type="Number">
        /// Gets or sets the fingers for this labs.
        /// </field>
        /// <field name="WBC" type="Number">
        /// Gets or sets the wBC for this labs.
        /// </field>
        /// <field name="Limbs" type="Number">
        /// Gets or sets the limbs for this labs.
        /// </field>
        /// <field name="Person" type="msls.application.Person">
        /// Gets or sets the person for this labs.
        /// </field>
        /// <field name="details" type="msls.application.Labs.Details">
        /// Gets the details for this labs.
        /// </field>
        $Entity.call(this, entitySet);
    }

    function ApplicationData(dataWorkspace) {
        /// <summary>
        /// Represents the ApplicationData data service.
        /// </summary>
        /// <param name="dataWorkspace" type="msls.DataWorkspace">
        /// The data workspace that created this data service.
        /// </param>
        /// <field name="People" type="msls.EntitySet">
        /// Gets the People entity set.
        /// </field>
        /// <field name="LabsSet" type="msls.EntitySet">
        /// Gets the LabsSet entity set.
        /// </field>
        /// <field name="details" type="msls.application.ApplicationData.Details">
        /// Gets the details for this data service.
        /// </field>
        $DataService.call(this, dataWorkspace);
    };
    function DataWorkspace() {
        /// <summary>
        /// Represents the data workspace.
        /// </summary>
        /// <field name="ApplicationData" type="msls.application.ApplicationData">
        /// Gets the ApplicationData data service.
        /// </field>
        /// <field name="details" type="msls.application.DataWorkspace.Details">
        /// Gets the details for this data workspace.
        /// </field>
        $DataWorkspace.call(this);
    };

    msls._addToNamespace("msls.application", {

        Person: $defineEntity(Person, [
            { name: "Id", type: Number },
            { name: "RowVersion", type: Array },
            { name: "Name", type: String },
            { name: "SSN", type: String },
            { name: "DOB", type: Date },
            { name: "LabsCollection", kind: "collection", elementType: Labs }
        ]),

        Labs: $defineEntity(Labs, [
            { name: "Id", type: Number },
            { name: "RowVersion", type: Array },
            { name: "LabDate", type: Date },
            { name: "Fingers", type: Number },
            { name: "WBC", type: Number },
            { name: "Limbs", type: Number },
            { name: "Person", kind: "reference", type: Person }
        ]),

        ApplicationData: $defineDataService(ApplicationData, lightSwitchApplication.rootUri + "/ApplicationData.svc", [
            { name: "People", elementType: Person },
            { name: "LabsSet", elementType: Labs }
        ], [
            {
                name: "People_SingleOrDefault", value: function (Id) {
                    return new $DataServiceQuery({ _entitySet: this.People },
                        lightSwitchApplication.rootUri + "/ApplicationData.svc" + "/People(" + "Id=" + $toODataString(Id, "Int32?") + ")"
                    );
                }
            },
            {
                name: "LabsSet_SingleOrDefault", value: function (Id) {
                    return new $DataServiceQuery({ _entitySet: this.LabsSet },
                        lightSwitchApplication.rootUri + "/ApplicationData.svc" + "/LabsSet(" + "Id=" + $toODataString(Id, "Int32?") + ")"
                    );
                }
            }
        ]),

        DataWorkspace: $defineDataWorkspace(DataWorkspace, [
            { name: "ApplicationData", type: ApplicationData }
        ])

    });

}(msls.application));
