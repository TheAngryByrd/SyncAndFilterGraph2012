using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.DataVisualization.Charting;
using Microsoft.LightSwitch.Presentation;

namespace SilverlightClassLibrary1
{
    public partial class SilverlightControl1 : UserControl
    {
        private List<string> dependentPathList = new List<string>() { "Fingers", "Limbs", "WBC" };
        private string independentPath = "LabDate";

        public SilverlightControl1()
        {
            InitializeComponent();
            this.Checklist.ItemsSource = dependentPathList;
            this.Loaded += new RoutedEventHandler(LabGraph_Loaded);      
        }

        /// <summary>
        /// The DataContext
        /// </summary>
        private IEnumerable<object> Labs
        {
            get
            {
                return (IEnumerable<object>)((IContentItem)this.DataContext).Value;
            }
        }

        public void CheckBoxZone_Checked(object sender, RoutedEventArgs e)
        {
            Redraw();
        }

        void LabGraph_Loaded(object sender, RoutedEventArgs e)
        {
            Redraw();
        }

        public void Redraw()
        {
            this.LabChart.Series.Clear();
            IEnumerable<CheckBox> children = this.Checklist.FindVisualChildren<CheckBox>().Where(i => i.IsChecked.Value); ;

            foreach (var item in children)
            {
             
                    //Create a new line series
                    var lineSeries = new LineSeries();
                    string contentPath = item.Content.ToString();
                    lineSeries.Title = contentPath;
                    lineSeries.Name = contentPath;
                    lineSeries.IndependentValuePath = independentPath;
                    lineSeries.DependentValuePath = contentPath;

                    //Only bind labs that aren't null, otherwise the graph shows zero for that day

                    IEnumerable<object> labSubSet = Labs.Where(lab => lab.GetPropertyValue(contentPath) != null);
                lineSeries.ItemsSource = labSubSet;
                //lineSeries.ItemsSource = Labs;

                    this.LabChart.Series.Add(lineSeries);
            

            }
        }

    }
}
