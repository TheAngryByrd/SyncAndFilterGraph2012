﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace LightSwitchApplication.Implementation
{
    
    #region Person
    [global::System.Runtime.Serialization.DataContract(Namespace = "http://schemas.datacontract.org/2004/07/ApplicationData.Implementation")]
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    public partial class Person :
        global::LightSwitchApplication.Person.DetailsClass.IImplementation
    {
        partial void OnIdChanged()
        {
            this.___OnPropertyChanged("Id");
        }
        
        partial void OnRowVersionChanged()
        {
            this.___OnPropertyChanged("RowVersion");
        }
        
        partial void OnNameChanged()
        {
            this.___OnPropertyChanged("Name");
        }
        
        partial void OnSSNChanged()
        {
            this.___OnPropertyChanged("SSN");
        }
        
        partial void OnDOBChanged()
        {
            this.___OnPropertyChanged("DOB");
        }
        
        global::System.Collections.IEnumerable global::LightSwitchApplication.Person.DetailsClass.IImplementation.LabsCollection
        {
            get
            {
                return this.LabsCollection;
            }
        }
        
        internal global::Microsoft.LightSwitch.ClientGenerated.Implementation.EntityRefCollection<global::LightSwitchApplication.Implementation.Labs> __LabsCollection
        {
            get
            {
                if (this.___LabsCollection == null)
                {
                    this.___LabsCollection = new global::Microsoft.LightSwitch.ClientGenerated.Implementation.EntityRefCollection<global::LightSwitchApplication.Implementation.Labs>(
                        this,
                        "LabsCollection",
                        () => this._LabsCollection,
                        e => global::System.Object.Equals(e.Labs_People, this.Id));
                }
                return this.___LabsCollection;
            }
        }
        
        private global::Microsoft.LightSwitch.ClientGenerated.Implementation.EntityRefCollection<global::LightSwitchApplication.Implementation.Labs> ___LabsCollection;
        
    }
    #endregion
    
    #region Labs
    [global::System.Runtime.Serialization.DataContract(Namespace = "http://schemas.datacontract.org/2004/07/ApplicationData.Implementation")]
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    public partial class Labs :
        global::LightSwitchApplication.Labs.DetailsClass.IImplementation
    {
        partial void OnLabs_PeopleChanged()
        {
            this.___OnPropertyChanged("Labs_People");
            this.___OnPropertyChanged("Person");
        }
        
        partial void OnIdChanged()
        {
            this.___OnPropertyChanged("Id");
        }
        
        partial void OnRowVersionChanged()
        {
            this.___OnPropertyChanged("RowVersion");
        }
        
        partial void OnLabDateChanged()
        {
            this.___OnPropertyChanged("LabDate");
        }
        
        partial void OnFingersChanged()
        {
            this.___OnPropertyChanged("Fingers");
        }
        
        partial void OnWBCChanged()
        {
            this.___OnPropertyChanged("WBC");
        }
        
        partial void OnLimbsChanged()
        {
            this.___OnPropertyChanged("Limbs");
        }
        
        global::Microsoft.LightSwitch.Internal.IEntityImplementation global::LightSwitchApplication.Labs.DetailsClass.IImplementation.Person
        {
            get
            {
                return this.Person;
            }
            set
            {
                this.Person = (global::LightSwitchApplication.Implementation.Person)value;
            }
        }
        
        private global::Microsoft.LightSwitch.ClientGenerated.Implementation.EntityRef<global::LightSwitchApplication.Implementation.Person> __Person
        {
            get
            {
                if (this.___Person == null)
                {
                    this.___Person = new global::Microsoft.LightSwitch.ClientGenerated.Implementation.EntityRef<global::LightSwitchApplication.Implementation.Person>(
                        this,
                        "Person",
                        new string[] { "Labs_People" },
                        e => global::System.Object.Equals(e.Id, this.Labs_People),
                        () => this._Person,
                        e => this._Person = e);
                }
                return this.___Person;
            }
        }
        
        private global::Microsoft.LightSwitch.ClientGenerated.Implementation.EntityRef<global::LightSwitchApplication.Implementation.Person> ___Person;
        
    }
    #endregion
    
    #region ApplicationDataObjectContext
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    public partial class ApplicationDataObjectContext
    {
        protected override global::Microsoft.LightSwitch.Internal.IEntityImplementation CreateEntityImplementation<T>()
        {
            if (typeof(T) == typeof(global::LightSwitchApplication.Person))
            {
                return new global::LightSwitchApplication.Implementation.Person();
            }
            if (typeof(T) == typeof(global::LightSwitchApplication.Labs))
            {
                return new global::LightSwitchApplication.Implementation.Labs();
            }
            return null;
        }
    }
    #endregion
    
    #region DataServiceImplementationFactory
    [global::System.ComponentModel.Composition.PartCreationPolicy(global::System.ComponentModel.Composition.CreationPolicy.Shared)]
    [global::System.ComponentModel.Composition.Export(typeof(global::Microsoft.LightSwitch.Internal.IDataServiceFactory))]
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    public class DataServiceFactory :
        global::Microsoft.LightSwitch.ClientGenerated.Implementation.DataServiceFactory
    {
    
        protected override global::Microsoft.LightSwitch.IDataService CreateDataService(global::System.Type dataServiceType)
        {
            if (dataServiceType == typeof(global::LightSwitchApplication.ApplicationData))
            {
                return new global::LightSwitchApplication.ApplicationData();
            }
            return base.CreateDataService(dataServiceType);
        }
    
        protected override global::Microsoft.LightSwitch.Internal.IDataServiceImplementation CreateDataServiceImplementation<TDataService>(TDataService dataService)
        {
            if (typeof(TDataService) == typeof(global::LightSwitchApplication.ApplicationData))
            {
                return new global::LightSwitchApplication.Implementation.ApplicationDataObjectContext(global::Microsoft.LightSwitch.ClientGenerated.Implementation.DataServiceContext.CreateServiceUri("../../ApplicationData.svc"));
            }
            return base.CreateDataServiceImplementation(dataService);
        }
    }
    #endregion
    
    [global::System.ComponentModel.Composition.PartCreationPolicy(global::System.ComponentModel.Composition.CreationPolicy.Shared)]
    [global::System.ComponentModel.Composition.Export(typeof(global::Microsoft.LightSwitch.Internal.ITypeMappingProvider))]
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    public class __TypeMapping
        : global::Microsoft.LightSwitch.Internal.ITypeMappingProvider
    {
        global::System.Type global::Microsoft.LightSwitch.Internal.ITypeMappingProvider.GetImplementationType(global::System.Type definitionType)
        {
            if (typeof(global::LightSwitchApplication.Person) == definitionType)
            {
                return typeof(global::LightSwitchApplication.Implementation.Person);
            }
            if (typeof(global::LightSwitchApplication.Labs) == definitionType)
            {
                return typeof(global::LightSwitchApplication.Implementation.Labs);
            }
            return null;
        }
    }
}
