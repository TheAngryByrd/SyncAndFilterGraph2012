﻿


//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace LightSwitchApplication
{
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
    public sealed partial class Application
        : global::Microsoft.LightSwitch.Framework.Client.ClientApplication<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass, global::LightSwitchApplication.DataWorkspace>
    {
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        public Application(global::Microsoft.LightSwitch.Model.IApplicationDefinition applicationDefinition) : base(applicationDefinition)
        {
            global::LightSwitchApplication.Application.DetailsClass.Initialize(this);
        }

        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void Application_Initialize();
        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void Application_LoggedIn();

        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        public static new global::LightSwitchApplication.Application Current
        {
            get
            {
                return (global::LightSwitchApplication.Application)global::Microsoft.LightSwitch.Framework.Client.ClientApplication<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Current;
            }
        }

        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void SearchPeople_CanRun(ref bool result);
        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void SearchPeople_Run(ref bool handled);
    
        /// <summary>
        /// Opens the ShowSearchPeople screen.  If the screen is already opened, it is activated and shown.
        /// </summary>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        public void ShowSearchPeople()
        {
            ((global::Microsoft.LightSwitch.Details.Client.IClientApplicationDetails)this.Details).InvokeMethod(this.Details.Methods.ShowSearchPeople);
        }
        
        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void PersonDetail_CanRun(ref bool result, int PersonId);
        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void PersonDetail_Run(ref bool handled, int PersonId);
    
        /// <summary>
        /// Opens the ShowPersonDetail screen.  If the screen is already opened, it is activated and shown.
        /// </summary>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        public void ShowPersonDetail(int PersonId)
        {
            ((global::Microsoft.LightSwitch.Details.Client.IClientApplicationDetails)this.Details).InvokeMethod(this.Details.Methods.ShowPersonDetail, PersonId);
        }
        
        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void EditablePeopleGrid_CanRun(ref bool result);
        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void EditablePeopleGrid_Run(ref bool handled);
    
        /// <summary>
        /// Opens the ShowEditablePeopleGrid screen.  If the screen is already opened, it is activated and shown.
        /// </summary>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        public void ShowEditablePeopleGrid()
        {
            ((global::Microsoft.LightSwitch.Details.Client.IClientApplicationDetails)this.Details).InvokeMethod(this.Details.Methods.ShowEditablePeopleGrid);
        }
        
        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void EditableLabsSetGrid_CanRun(ref bool result);
        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        partial void EditableLabsSetGrid_Run(ref bool handled);
    
        /// <summary>
        /// Opens the ShowEditableLabsSetGrid screen.  If the screen is already opened, it is activated and shown.
        /// </summary>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        public void ShowEditableLabsSetGrid()
        {
            ((global::Microsoft.LightSwitch.Details.Client.IClientApplicationDetails)this.Details).InvokeMethod(this.Details.Methods.ShowEditableLabsSetGrid);
        }
        
        [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Never)]
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
        [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
        public sealed class DetailsClass
            : global::Microsoft.LightSwitch.Details.Framework.Client.ClientApplicationDetails<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass, global::LightSwitchApplication.Application.DetailsClass.PropertySet, global::LightSwitchApplication.Application.DetailsClass.CommandSet, global::LightSwitchApplication.Application.DetailsClass.MethodSet>
        {

            static DetailsClass()
            {
                var initializeCommandEntry = global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties.ShowSearchPeople;
                var initializeMethodEntry = global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties.ShowSearchPeople;
            }

            [global::System.Diagnostics.DebuggerBrowsable(global::System.Diagnostics.DebuggerBrowsableState.Never)]
            private static readonly global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationDetails<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry
                __ApplicationEntry = new global::Microsoft.LightSwitch.Details.Framework.Client.ClientApplicationDetails<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry(
                    global::LightSwitchApplication.Application.DetailsClass.__Application_Initialized,
                    global::LightSwitchApplication.Application.DetailsClass.__Application_LoggedIn);
            private static void __Application_Initialized(global::LightSwitchApplication.Application a)
            {
                a.Application_Initialize();
            }
            private static void __Application_LoggedIn(global::LightSwitchApplication.Application a)
            {
                a.Application_LoggedIn();
            }

            public DetailsClass() : base()
            {
            }

            public new global::LightSwitchApplication.Application.DetailsClass.PropertySet Properties
            {
                get
                {
                    return base.Properties;
                }
            }

            public new global::LightSwitchApplication.Application.DetailsClass.CommandSet Commands
            {
                get
                {
                    return base.Commands;
                }
            }

            public new global::LightSwitchApplication.Application.DetailsClass.MethodSet Methods
            {
                get
                {
                    return base.Methods;
                }
            }

            protected override global::Microsoft.LightSwitch.Client.IScreenObject CreateScreen(string screenName, params object[] args)
            {
                switch (screenName)
                {
                    case "SearchPeople":
                        return global::LightSwitchApplication.SearchPeople.CreateInstance();
                    case "PersonDetail":
                        return global::LightSwitchApplication.PersonDetail.CreateInstance((int)args[0]);
                    case "EditablePeopleGrid":
                        return global::LightSwitchApplication.EditablePeopleGrid.CreateInstance();
                    case "EditableLabsSetGrid":
                        return global::LightSwitchApplication.EditableLabsSetGrid.CreateInstance();
                }
            
                return base.CreateScreen(screenName, args);
            }
            
            [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Never)]
            [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
            [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
            public sealed class PropertySet
                : global::Microsoft.LightSwitch.Details.Framework.Client.ClientApplicationPropertySet<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>
            {

            }

            [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Never)]
            [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
            [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
            public sealed class CommandSet
                : global::Microsoft.LightSwitch.Details.Framework.Client.ClientApplicationCommandSet<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>
            {

                public global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass> ShowSearchPeople
                {
                    get
                    {
                        return (global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>)
                               base.GetItem(global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties.ShowSearchPeople);
                    }
                }

                public global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass> ShowEditablePeopleGrid
                {
                    get
                    {
                        return (global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>)
                               base.GetItem(global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties.ShowEditablePeopleGrid);
                    }
                }

                public global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass> ShowEditableLabsSetGrid
                {
                    get
                    {
                        return (global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>)
                               base.GetItem(global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties.ShowEditableLabsSetGrid);
                    }
                }

            }

            [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Never)]
            [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
            [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
            public sealed class MethodSet
                : global::Microsoft.LightSwitch.Details.Framework.Client.ClientApplicationMethodSet<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>
            {

                public global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass> ShowSearchPeople
                {
                    get
                    {
                        return (global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>)
                               base.GetItem(global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties.ShowSearchPeople);
                    }
                }

                public global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass> ShowPersonDetail
                {
                    get
                    {
                        return (global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>)
                               base.GetItem(global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties.ShowPersonDetail);
                    }
                }

                public global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass> ShowEditablePeopleGrid
                {
                    get
                    {
                        return (global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>)
                               base.GetItem(global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties.ShowEditablePeopleGrid);
                    }
                }

                public global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass> ShowEditableLabsSetGrid
                {
                    get
                    {
                        return (global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>)
                               base.GetItem(global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties.ShowEditableLabsSetGrid);
                    }
                }

            }

            [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Never)]
            [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
            [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
            internal sealed class PropertySetProperties
            {

            }

            [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Never)]
            [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
            [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
            internal sealed class CommandSetProperties
            {

                public static readonly global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry
                    ShowSearchPeople = new global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry(
                        "ShowSearchPeople",
                        global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties._ShowSearchPeople_Stub,
                        global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties._ShowSearchPeople_CreateExecutableObject);
                private static void _ShowSearchPeople_Stub(global::Microsoft.LightSwitch.Details.Framework.Base.DetailsCallback<global::LightSwitchApplication.Application.DetailsClass, global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data> c, global::LightSwitchApplication.Application.DetailsClass d, object sf)
                {
                    c(d, ref d._ShowSearchPeopleCommand, sf);
                }
                private static global::Microsoft.LightSwitch.IExecutable _ShowSearchPeople_CreateExecutableObject(global::LightSwitchApplication.Application.DetailsClass d)
                {
                    return ((global::LightSwitchApplication.Application.DetailsClass)d).Methods.ShowSearchPeople.CreateInvocation(new object[0]);
                }

                public static readonly global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry
                    ShowEditablePeopleGrid = new global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry(
                        "ShowEditablePeopleGrid",
                        global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties._ShowEditablePeopleGrid_Stub,
                        global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties._ShowEditablePeopleGrid_CreateExecutableObject);
                private static void _ShowEditablePeopleGrid_Stub(global::Microsoft.LightSwitch.Details.Framework.Base.DetailsCallback<global::LightSwitchApplication.Application.DetailsClass, global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data> c, global::LightSwitchApplication.Application.DetailsClass d, object sf)
                {
                    c(d, ref d._ShowEditablePeopleGridCommand, sf);
                }
                private static global::Microsoft.LightSwitch.IExecutable _ShowEditablePeopleGrid_CreateExecutableObject(global::LightSwitchApplication.Application.DetailsClass d)
                {
                    return ((global::LightSwitchApplication.Application.DetailsClass)d).Methods.ShowEditablePeopleGrid.CreateInvocation(new object[0]);
                }

                public static readonly global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry
                    ShowEditableLabsSetGrid = new global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry(
                        "ShowEditableLabsSetGrid",
                        global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties._ShowEditableLabsSetGrid_Stub,
                        global::LightSwitchApplication.Application.DetailsClass.CommandSetProperties._ShowEditableLabsSetGrid_CreateExecutableObject);
                private static void _ShowEditableLabsSetGrid_Stub(global::Microsoft.LightSwitch.Details.Framework.Base.DetailsCallback<global::LightSwitchApplication.Application.DetailsClass, global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data> c, global::LightSwitchApplication.Application.DetailsClass d, object sf)
                {
                    c(d, ref d._ShowEditableLabsSetGridCommand, sf);
                }
                private static global::Microsoft.LightSwitch.IExecutable _ShowEditableLabsSetGrid_CreateExecutableObject(global::LightSwitchApplication.Application.DetailsClass d)
                {
                    return ((global::LightSwitchApplication.Application.DetailsClass)d).Methods.ShowEditableLabsSetGrid.CreateInvocation(new object[0]);
                }

            }

            [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Never)]
            [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.3.0.0")]
            [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
            internal sealed class MethodSetProperties
            {

                public static readonly global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry
                    ShowSearchPeople = new global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry(
                        "ShowSearchPeople",
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowSearchPeople_Stub,
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowSearchPeople_CanInvoke,
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowSearchPeople_InvokeMethod);
                private static void _ShowSearchPeople_Stub(global::Microsoft.LightSwitch.Details.Framework.Base.DetailsCallback<global::LightSwitchApplication.Application.DetailsClass, global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data> c, global::LightSwitchApplication.Application.DetailsClass d, object sf)
                {
                    c(d, ref d._ShowSearchPeopleMethod, sf);
                }
                private static global::System.Exception _ShowSearchPeople_CanInvoke(global::LightSwitchApplication.Application.DetailsClass d, global::System.Collections.ObjectModel.ReadOnlyCollection<object> args, global::System.Exception ex)
                {
                    bool result = true;
                    d.Application.SearchPeople_CanRun(ref result);
                    return result ? null : ex;
                }
                private static void _ShowSearchPeople_InvokeMethod(global::LightSwitchApplication.Application.DetailsClass d, global::System.Collections.ObjectModel.ReadOnlyCollection<object> args)
                {
                    bool handled = false;
                    d.Application.SearchPeople_Run(ref handled);
                    if (!handled)
                    {
                        d.ShowScreen("LightSwitchApplication.DesktopClient:SearchPeople", () => global::LightSwitchApplication.SearchPeople.CreateInstance(), args);
                    }
                }
 
                public static readonly global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry
                    ShowPersonDetail = new global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry(
                        "ShowPersonDetail",
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowPersonDetail_Stub,
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowPersonDetail_CanInvoke,
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowPersonDetail_InvokeMethod);
                private static void _ShowPersonDetail_Stub(global::Microsoft.LightSwitch.Details.Framework.Base.DetailsCallback<global::LightSwitchApplication.Application.DetailsClass, global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data> c, global::LightSwitchApplication.Application.DetailsClass d, object sf)
                {
                    c(d, ref d._ShowPersonDetailMethod, sf);
                }
                private static global::System.Exception _ShowPersonDetail_CanInvoke(global::LightSwitchApplication.Application.DetailsClass d, global::System.Collections.ObjectModel.ReadOnlyCollection<object> args, global::System.Exception ex)
                {
                    bool result = true;
                    d.Application.PersonDetail_CanRun(ref result, (int)args[0]);
                    return result ? null : ex;
                }
                private static void _ShowPersonDetail_InvokeMethod(global::LightSwitchApplication.Application.DetailsClass d, global::System.Collections.ObjectModel.ReadOnlyCollection<object> args)
                {
                    bool handled = false;
                    d.Application.PersonDetail_Run(ref handled, (int)args[0]);
                    if (!handled)
                    {
                        d.ShowScreen("LightSwitchApplication.DesktopClient:PersonDetail", () => global::LightSwitchApplication.PersonDetail.CreateInstance((int)args[0]), args);
                    }
                }
 
                public static readonly global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry
                    ShowEditablePeopleGrid = new global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry(
                        "ShowEditablePeopleGrid",
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowEditablePeopleGrid_Stub,
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowEditablePeopleGrid_CanInvoke,
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowEditablePeopleGrid_InvokeMethod);
                private static void _ShowEditablePeopleGrid_Stub(global::Microsoft.LightSwitch.Details.Framework.Base.DetailsCallback<global::LightSwitchApplication.Application.DetailsClass, global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data> c, global::LightSwitchApplication.Application.DetailsClass d, object sf)
                {
                    c(d, ref d._ShowEditablePeopleGridMethod, sf);
                }
                private static global::System.Exception _ShowEditablePeopleGrid_CanInvoke(global::LightSwitchApplication.Application.DetailsClass d, global::System.Collections.ObjectModel.ReadOnlyCollection<object> args, global::System.Exception ex)
                {
                    bool result = true;
                    d.Application.EditablePeopleGrid_CanRun(ref result);
                    return result ? null : ex;
                }
                private static void _ShowEditablePeopleGrid_InvokeMethod(global::LightSwitchApplication.Application.DetailsClass d, global::System.Collections.ObjectModel.ReadOnlyCollection<object> args)
                {
                    bool handled = false;
                    d.Application.EditablePeopleGrid_Run(ref handled);
                    if (!handled)
                    {
                        d.ShowScreen("LightSwitchApplication.DesktopClient:EditablePeopleGrid", () => global::LightSwitchApplication.EditablePeopleGrid.CreateInstance(), args);
                    }
                }
 
                public static readonly global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry
                    ShowEditableLabsSetGrid = new global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Entry(
                        "ShowEditableLabsSetGrid",
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowEditableLabsSetGrid_Stub,
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowEditableLabsSetGrid_CanInvoke,
                        global::LightSwitchApplication.Application.DetailsClass.MethodSetProperties._ShowEditableLabsSetGrid_InvokeMethod);
                private static void _ShowEditableLabsSetGrid_Stub(global::Microsoft.LightSwitch.Details.Framework.Base.DetailsCallback<global::LightSwitchApplication.Application.DetailsClass, global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data> c, global::LightSwitchApplication.Application.DetailsClass d, object sf)
                {
                    c(d, ref d._ShowEditableLabsSetGridMethod, sf);
                }
                private static global::System.Exception _ShowEditableLabsSetGrid_CanInvoke(global::LightSwitchApplication.Application.DetailsClass d, global::System.Collections.ObjectModel.ReadOnlyCollection<object> args, global::System.Exception ex)
                {
                    bool result = true;
                    d.Application.EditableLabsSetGrid_CanRun(ref result);
                    return result ? null : ex;
                }
                private static void _ShowEditableLabsSetGrid_InvokeMethod(global::LightSwitchApplication.Application.DetailsClass d, global::System.Collections.ObjectModel.ReadOnlyCollection<object> args)
                {
                    bool handled = false;
                    d.Application.EditableLabsSetGrid_Run(ref handled);
                    if (!handled)
                    {
                        d.ShowScreen("LightSwitchApplication.DesktopClient:EditableLabsSetGrid", () => global::LightSwitchApplication.EditableLabsSetGrid.CreateInstance(), args);
                    }
                }
 
            }

            private global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data _ShowSearchPeopleMethod;

            private global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data _ShowPersonDetailMethod;

            private global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data _ShowEditablePeopleGridMethod;

            private global::Microsoft.LightSwitch.Details.Framework.ApplicationMethod<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data _ShowEditableLabsSetGridMethod;

            private global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data _ShowSearchPeopleCommand;

            private global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data _ShowEditablePeopleGridCommand;

            private global::Microsoft.LightSwitch.Details.Framework.Base.ApplicationCommand<global::LightSwitchApplication.Application, global::LightSwitchApplication.Application.DetailsClass>.Data _ShowEditableLabsSetGridCommand;

        }
    }

    [global::System.ComponentModel.Composition.Export(typeof(global::Microsoft.LightSwitch.Model.IModuleDefinitionLoader))]
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.LightSwitch.BuildTasks.CodeGen", "11.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.ComponentModel.EditorBrowsable(global::System.ComponentModel.EditorBrowsableState.Never)]
    [global::Microsoft.LightSwitch.Model.ModuleDefinitionLoader("LightSwitchApplication.DesktopClient")]
    public class ClientModuleLoader : global::Microsoft.LightSwitch.Model.IModuleDefinitionLoader
    {
        public global::System.Resources.ResourceManager GetModelResourceManager()
        {
            return null;
        }
    
        public global::System.Collections.Generic.IEnumerable<global::System.IO.Stream> LoadModelFragments()
        {
            global::System.Reflection.Assembly assembly = global::System.Reflection.Assembly.GetExecutingAssembly();
            global::System.Collections.Generic.List<global::System.IO.Stream> streams = new global::System.Collections.Generic.List<global::System.IO.Stream>();
    
            foreach (string resourceName in assembly.GetManifestResourceNames())
            {
                if (resourceName.EndsWith(".lsml", global::System.StringComparison.OrdinalIgnoreCase))
                {
                    streams.Add(assembly.GetManifestResourceStream(resourceName));
                }
            }
    
            return streams;
        }
    }
}