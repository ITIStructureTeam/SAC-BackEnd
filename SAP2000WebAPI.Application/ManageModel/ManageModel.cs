using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Runtime.Versioning;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SAP2000v18;
using SAP2000WebAPI.Domain;

namespace SAP2000WebAPI.Application.ManageModel
{
    // replace the InteropServices.Marshall class for .NET core
    public static class Marshal2
    {
        internal const String OLEAUT32 = "oleaut32.dll";
        internal const String OLE32 = "ole32.dll";

        [System.Security.SecurityCritical]  // auto-generated_required
        public static Object GetActiveObject(String progID)
        {
            Object obj = null;
            Guid clsid;

            // Call CLSIDFromProgIDEx first then fall back on CLSIDFromProgID if
            // CLSIDFromProgIDEx doesn't exist.
            try
            {
                CLSIDFromProgIDEx(progID, out clsid);
            }
            //            catch
            catch (Exception)
            {
                CLSIDFromProgID(progID, out clsid);
            }

            GetActiveObject(ref clsid, IntPtr.Zero, out obj);
            return obj;
        }

        //[DllImport(Microsoft.Win32.Win32Native.OLE32, PreserveSig = false)]
        [DllImport(OLE32, PreserveSig = false)]
        [ResourceExposure(ResourceScope.None)]
        [SuppressUnmanagedCodeSecurity]
        [SecurityCritical]  // auto-generated
        private static extern void CLSIDFromProgIDEx([MarshalAs(UnmanagedType.LPWStr)] String progId, out Guid clsid);

        //[DllImport(Microsoft.Win32.Win32Native.OLE32, PreserveSig = false)]
        [DllImport(OLE32, PreserveSig = false)]
        [ResourceExposure(ResourceScope.None)]
        [SuppressUnmanagedCodeSecurity]
        [SecurityCritical]  // auto-generated
        private static extern void CLSIDFromProgID([MarshalAs(UnmanagedType.LPWStr)] String progId, out Guid clsid);

        //[DllImport(Microsoft.Win32.Win32Native.OLEAUT32, PreserveSig = false)]
        [DllImport(OLEAUT32, PreserveSig = false)]
        [ResourceExposure(ResourceScope.None)]
        [SuppressUnmanagedCodeSecurity]
        [SecurityCritical]  // auto-generated
        private static extern void GetActiveObject(ref Guid rclsid, IntPtr reserved, [MarshalAs(UnmanagedType.Interface)] out Object ppunk);

    }

    public class ManageModel : IMangeModel
    {
        #region Validate Model Name

        public static bool CheckModelName(string ProjectName)
        {
            string ModelDirectory = @"E:\SAC Projects\" + ProjectName;
            if (Directory.Exists(ModelDirectory))
            {
                return false;
            }    
            else
            {
                try
                {
                    Directory.CreateDirectory(ModelDirectory);
                    Directory.Delete(ModelDirectory);
                    return true;
                }
                catch
                {
                    return false;
                }                                  
            }
        }

        #endregion

        public static void CheckAgain()
        {

        }

        #region Import Project

        //import all project Names
        //it will have user data in the future to allow access to certain folder
        public static List<string> GetProjectsNames()
        {
            string ModelDirectory = @"E:\SAC Projects"; //replaced by user directory
            string[] subdirectoryEntries = Directory.GetDirectories(ModelDirectory);
            List<string> ProjectsName = new List<string>();
            foreach (var Dir in subdirectoryEntries)
            {
                ProjectsName.Add(Path.GetFileName(Dir));
            }
            return ProjectsName;
        }

        //import prject json file based on name
        public static string ImportProject(string ProjectName)
        {
            string jsonData = string.Empty;

            using (StreamReader r = new StreamReader(@"E:\SAC Projects\" + ProjectName + @"\Model JSON Data\" + "ModelData.json"))
            {
                jsonData = r.ReadToEnd();
                r.Close();
            }

            return jsonData;
        }

        #endregion

        #region Save Model Data as .Json

        public static void SaveModel(RootObject ModelDataObject)
        {
            string ModelName = ModelDataObject.ProjectName.Trim();
            string ProjectDir = @"E:\SAC Projects\" + ModelName;
            string JsonDirectory = @"E:\SAC Projects\" + ModelName + @"\Model JSON Data";
            string JsonPath = JsonDirectory + Path.DirectorySeparatorChar + "ModelData.json";

            string ModelJsonData = JsonConvert.SerializeObject(ModelDataObject);            

            if (!Directory.Exists(ProjectDir))
            {
                Directory.CreateDirectory(ProjectDir);
                Directory.CreateDirectory(JsonDirectory);
            }            

            if (File.Exists(JsonPath))
            {
                File.Delete(JsonPath);
                using (StreamWriter w = new StreamWriter(JsonPath, true))
                {
                    w.WriteLine(ModelJsonData.ToString());
                    w.Close();
                }
            }
            else if (!File.Exists(JsonPath))
            {
                using (StreamWriter w = new StreamWriter(JsonPath, true))
                {
                    w.WriteLine(ModelJsonData.ToString());
                    w.Close();
                }
            }
        }

        #endregion

        #region Create SAP Model & Get Results

        public static SapResults CreateModel(string ProjectName)
        {

            #region Setup Model

            RootObject ModelDataObject;
            ProjectName = ProjectName.Trim();

            string ModelDirectory = @"E:\SAC Projects\" + ProjectName + @"\SAP Model";

            if (!Directory.Exists(ModelDirectory))
            {
                Directory.CreateDirectory(ModelDirectory);
            }
            else
            {
                Directory.Delete(ModelDirectory, true);
                Directory.CreateDirectory(ModelDirectory);
            }

            using (StreamReader r = new StreamReader(@"E:\SAC Projects\" + ProjectName + @"\Model JSON Data\" + "ModelData.json"))
            {
                string jsonData = r.ReadToEnd();
                ModelDataObject = JsonConvert.DeserializeObject<RootObject>(jsonData);
                r.Close();
            }

            string ModelPath = ModelDirectory + Path.DirectorySeparatorChar + ModelDataObject.ProjectName;

            cOAPI mySapObject = null;

            try
            {
                //get the active Sap2000 object
                mySapObject = Marshal2.GetActiveObject("CSI.SAP2000.API.SapObject") as cOAPI;
            }
            catch (Exception ex)
            {
                Console.WriteLine("No running instance of the program found or failed to attach.");
            }
            #endregion

            //SAP API functions return values place holder (0 == success)                                              
            int ret;

            //global variable
            int i, j, k;

            #region Setup Model & Definitions

            #region Initialize Model
            //create SapModel object
            cSapModel mySapModel = mySapObject.SapModel;

            //initialize model
            ret = mySapModel.InitializeNewModel((eUnits.kN_m_C));

            //create new blank model
            ret = mySapModel.File.NewBlank();

            #endregion

            #region Define Materials

            //Material Enum place holder (1 = steel, 0 = concrete)
            eMatType MaterialType_ = eMatType.Concrete;

            //define material properties

            //get number of materials objects in the list
            int MaterialsCount = ModelDataObject.Materials.Count();

            //loop for each Material in the list
            for (i = 0; i < MaterialsCount; i++)
            {
                //get material type from eMatType Enum
                if (ModelDataObject.Materials[i].MaterialType == 0)
                {
                    MaterialType_ = eMatType.Concrete;
                }
                else if (ModelDataObject.Materials[i].MaterialType == 1)
                {
                    MaterialType_ = eMatType.Steel;
                }
                //create material in SAP model
                ret = mySapModel.PropMaterial.SetMaterial(
                    ModelDataObject.Materials[i].Name,
                    MaterialType_);
                //assign isotropic mechanical properties to material 
                ret = mySapModel.PropMaterial.SetMPIsotropic(
                    ModelDataObject.Materials[i].Name,
                    ModelDataObject.Materials[i].ElasticModulus * 1000,
                    ModelDataObject.Materials[i].Poisson,
                    ModelDataObject.Materials[i].ThermalExpansion);
                // assign Weight per unit volume property to material
                 ret = mySapModel.PropMaterial.SetWeightAndMass(
                    ModelDataObject.Materials[i].Name,
                    1,                                                         //sets that we are adding weight not mass
                    ModelDataObject.Materials[i].Weight);
                //Assign Special Concrete/Steel properties to the created material
                //if concrete
                if(ModelDataObject.Materials[i].MaterialType == 0)
                {
                    ret = mySapModel.PropMaterial.SetOConcrete_1(
                    ModelDataObject.Materials[i].Name,
                    ModelDataObject.Materials[i].Strength[0] * 1000,
                    false, 0, 2, 2, 0.0022, 0.0052, -0.1);                      //Advanced material properties that we don't deal with yet
                }
                //if steel
                else if (ModelDataObject.Materials[i].MaterialType == 1)
                {
                    ret = mySapModel.PropMaterial.SetOSteel_1(
                        ModelDataObject.Materials[i].Name,
                        ModelDataObject.Materials[i].Strength[0] * 1000,       //Add notes
                        ModelDataObject.Materials[i].Strength[1] * 1000,
                        ModelDataObject.Materials[i].Strength[0] * 1000,
                        ModelDataObject.Materials[i].Strength[1] * 1000,
                        1, 1, 0.015, 0.11, 0.17, -0.1);                  //Advanced material properties that we don't deal with yet
                }                    
            }
            #endregion

            #region Define Sections & prop. Modifiers

            //define sections properties

            //get number of materials objects in the list
            int SectionsCount = ModelDataObject.Sections.Count();

            //loop for each section in the list
            for (i = 0; i < SectionsCount; i++)
            {
                //check section type to call proper add section function
                //if Rectangle 
                if (ModelDataObject.Sections[i].SecType == 0)
                {
                    ret = mySapModel.PropFrame.SetRectangle(
                        ModelDataObject.Sections[i].Name,
                        ModelDataObject.Sections[i].Material,
                        ModelDataObject.Sections[i].Dimensions[1],      //Depth
                        ModelDataObject.Sections[i].Dimensions[0]);     //Width            
                }
                //if Circle
                else if (ModelDataObject.Sections[i].SecType == 1)
                {
                    ret = mySapModel.PropFrame.SetCircle(
                        ModelDataObject.Sections[i].Name,
                        ModelDataObject.Sections[i].Material,
                        ModelDataObject.Sections[i].Dimensions[0]);     //Radius
                }
                //if I-Section
                else if (ModelDataObject.Sections[i].SecType == 2)
                {
                    ret = mySapModel.PropFrame.SetISection(
                        ModelDataObject.Sections[i].Name,
                        ModelDataObject.Sections[i].Material,
                        ModelDataObject.Sections[i].Dimensions[0],      //The section depth
                        ModelDataObject.Sections[i].Dimensions[1],      //The top flange width
                        ModelDataObject.Sections[i].Dimensions[2],      //The top flange thickness
                        ModelDataObject.Sections[i].Dimensions[3],      //The web thickness
                        ModelDataObject.Sections[i].Dimensions[4],      //The bottom flange width
                        ModelDataObject.Sections[i].Dimensions[5]);     //The bottom flange thickness
                }
                //if T-Section
                else if (ModelDataObject.Sections[i].SecType == 3)
                {
                    ret = mySapModel.PropFrame.SetTee(
                        ModelDataObject.Sections[i].Name,
                        ModelDataObject.Sections[i].Material,
                        ModelDataObject.Sections[i].Dimensions[0],       //The section depth   
                        ModelDataObject.Sections[i].Dimensions[1],       //The flange width
                        ModelDataObject.Sections[i].Dimensions[2],       //The flange thickness
                        ModelDataObject.Sections[i].Dimensions[3]);      //The web thickness
                }
                //define frame section property modifiers            
                double[] ModValue = new double[8];
                for (j = 0; j <= 7; j++)
                {
                    ModValue[j] = ModelDataObject.Sections[i].PropModifiers[j];
                }
                ret = mySapModel.PropFrame.SetModifiers(
                    ModelDataObject.Sections[i].Name,
                    ref ModValue);
            }
            #endregion

            #region Define Load Patterns

            //declare variables
            int LoadPatternType = 0;

            //get number of framess objects in the list
            int LoadPatternCount = ModelDataObject.Patterns.Count();

            //loop for each Point in the list
            for (i = 0; i < LoadPatternCount; i++)
            {
                eLoadPatternType SapPatternType = eLoadPatternType.Other;
                LoadPatternType = ModelDataObject.Patterns[i].Details.Type;

                if (LoadPatternType == 0)
                {
                    SapPatternType = eLoadPatternType.Dead;
                }
                else if (LoadPatternType == 1)
                {
                    SapPatternType = eLoadPatternType.Live;
                }
                else if (LoadPatternType == 2)
                {
                    SapPatternType = eLoadPatternType.Wind;
                }
                else if (LoadPatternType == 3)
                {
                    SapPatternType = eLoadPatternType.Other;
                }
                ret = mySapModel.LoadPatterns.Add(
                    ModelDataObject.Patterns[i].PatternID,
                    SapPatternType,
                    ModelDataObject.Patterns[i].Details.SelfWtMult,
                    true);
            }

            //Delete irrelevant load patterns and load cases (Auto Defined from SAP)
            ret = mySapModel.LoadCases.Delete("MODAL");
            ret = mySapModel.LoadCases.Delete("DEAD");
            ret = mySapModel.LoadPatterns.Delete("DEAD");

            #endregion

            #region Define Load Combinations

            //get number of Load combinations in the list
            int LoadCombinationCount = ModelDataObject.Combinations.Count();
            int LoadCombinationParamCount;
            eCNameType eCNameType = eCNameType.LoadCase;

            //loop for each Point in the list
            for (i = 0; i < LoadCombinationCount; i++)
            {
                //Add Load combination name
                ret = mySapModel.RespCombo.Add(
                    ModelDataObject.Combinations[i].CombinationID,
                    0);

                //get number of Load combinations in the list
                LoadCombinationParamCount = ModelDataObject.Combinations[i].Details.Info.Count();

                //add load combination parameters
                for (j = 0; j < LoadCombinationParamCount; j++)
                {
                    //add load cases to cmbinations
                    ret = mySapModel.RespCombo.SetCaseList(
                    ModelDataObject.Combinations[i].CombinationID,
                    ref eCNameType,                                                      //indicates that the parameters are load cases
                    ModelDataObject.Combinations[i].Details.Info[j].caseId,
                    ModelDataObject.Combinations[i].Details.Info[j].scaleFactor);
                }
            }

            #endregion

            #endregion

            #region Create Model in SAP

            #region Create Points & assign restraints

            //declare variables
            bool[] RestraintsValue;

            //get number of framess objects in the list
            int PointsCount = ModelDataObject.Points.Count();

            //place holder for the auto generated Point Name in SAP
            string TempPointName = "";

            //loop for each Point in the list
            for (i = 0; i < PointsCount; i++)
            {
                //create each point and assign labels
                ret = mySapModel.PointObj.AddCartesian(
                    ModelDataObject.Points[i].position[0],
                    ModelDataObject.Points[i].position[1],
                    ModelDataObject.Points[i].position[2],
                    ref TempPointName,
                    ModelDataObject.Points[i].label.ToString(),
                    "Global");
                //add the restraints int local array
                RestraintsValue = new bool[6];
                for (j = 0; j <= 5; j++)
                {
                    RestraintsValue[j] = ModelDataObject.Points[i].Restraints[j];
                }
                //assign restraints to points
                ret = mySapModel.PointObj.SetRestraint(
                    ModelDataObject.Points[i].label.ToString(),
                    ref RestraintsValue,                    
                    0);
            }

            #endregion         

            #region Draw Frames

            //Declare local varaibles for frames
            int LoadPatternsCount;
            int LoadsCount;
            string SapCordinateSys = "Global";
            int LoadDir = 0;
            double FrameLength;
            List<DeformationPoints> DeformationPoints_ = new List<DeformationPoints>();            
            List<DummyPoint> DeformationPointsPos = new List<DummyPoint>();
            double[] FrameStartPoint = new double[3];
            double[] FrameEndPoint = new double[3];
            int DeformationPointsPosCount;
            int NumberofStations = 0;

            //get number of frames objects in the list
            int FramesCount = ModelDataObject.Frames.Count();

            //place holder for the auto generated frameName in SAP
            string FrameName = "";

            List<string> PointsNamesTest = new List<string>();

            //loop for each Frame in the list
            for (i = 0; i < FramesCount; i++)
            {
                //add frame object by coordinates
                ret = mySapModel.FrameObj.AddByPoint(
                    ModelDataObject.Frames[i].StartPoint.ToString(),
                    ModelDataObject.Frames[i].EndPoint.ToString(),
                    ref FrameName,
                    ModelDataObject.Frames[i].Section,
                    ModelDataObject.Frames[i].Label.ToString());

                //Set Frame Rotation
                ret = mySapModel.FrameObj.SetLocalAxes(
                    ModelDataObject.Frames[i].Label.ToString(),
                    ModelDataObject.Frames[i].Rotation);

                //Set Frame Loads
                if (ModelDataObject.Frames[i].Loads.Count() > 0)
                {                    
                    //get Load Patterns count
                    LoadPatternsCount = ModelDataObject.Frames[i].Loads.Count();

                    //Load into each load pattern
                    for (j = 0; j < LoadPatternsCount; j++)
                    {
                        //get Loads count
                        LoadsCount = ModelDataObject.Frames[i].Loads[j].LoadDetails.Count();

                        //assign each Load to the frame
                        for (k = 0; k < LoadsCount; k++)
                        {              
                            //check if Csys is global or local
                            if (ModelDataObject.Frames[i].Loads[j].LoadDetails[k].CoordSys == false)
                            {
                                SapCordinateSys = "Global";
                            }
                            else if (ModelDataObject.Frames[i].Loads[j].LoadDetails[k].CoordSys == true)
                            {
                                SapCordinateSys = "Local";
                            }
                            //convert the load direction from our values to sap related values
                            if (SapCordinateSys == "Global")
                            {
                                switch (ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Dir)
                                {
                                    case 1:
                                        LoadDir = 4;
                                        break;
                                    case 2:
                                        LoadDir = 6;
                                        break;
                                    case 3:
                                        LoadDir = 5;
                                        break;
                                }
                            }
                            else if (SapCordinateSys == "Local")
                            {
                                switch (ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Dir)
                                {
                                    case 1:
                                        LoadDir = 1;
                                        break;
                                    case 2:
                                        LoadDir = 2;
                                        break;
                                    case 3:
                                        LoadDir = 3;
                                        break;
                                }
                            }
                            //assign point loads
                            if (ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Shape == 0)
                            {
                                ret = mySapModel.FrameObj.SetLoadPoint(
                                    ModelDataObject.Frames[i].Label.ToString(),
                                    ModelDataObject.Frames[i].Loads[j].Pattern,
                                    ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Type + 1,
                                    LoadDir,
                                    ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Distance[0],
                                    ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Magnitude[0],
                                    SapCordinateSys,
                                    true,
                                    false);
                            }
                            //assign Distributed loads
                            else if (ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Shape == 1)
                            {
                                ret = mySapModel.FrameObj.SetLoadDistributed(
                                    ModelDataObject.Frames[i].Label.ToString(),
                                    ModelDataObject.Frames[i].Loads[j].Pattern,
                                    ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Type + 1,
                                    LoadDir,
                                    ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Distance[0],
                                    ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Distance[1],
                                    ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Magnitude[0],
                                    ModelDataObject.Frames[i].Loads[j].LoadDetails[k].Magnitude[1],
                                    SapCordinateSys,
                                    true,
                                    false);
                            }
                        }                        
                    }
                }
                
                //get frame start and end position
                FrameStartPoint = ModelDataObject.Points.Find(key => key.label == ModelDataObject.Frames[i].StartPoint).position;
                FrameEndPoint = ModelDataObject.Points.Find(key => key.label == ModelDataObject.Frames[i].EndPoint).position;

                //Frame total length
                FrameLength = GetFrameLength(
                        FrameStartPoint,
                        FrameEndPoint);

                NumberofStations = (int)(Math.Round(FrameLength * 2));
                if (NumberofStations < 3)
                {
                    NumberofStations = 3;
                }

                //set Frame results output stations
                ret = mySapModel.FrameObj.SetOutputStations(
                    ModelDataObject.Frames[i].Label.ToString(),
                    2,                                               //set the output station type to minimum number of segment 
                    2,                                               //ignored value
                    NumberofStations,
                    false,
                    false);                                             //set number of segments

                DeformationPoints DeformationPoint = new DeformationPoints();

                //add frame first point
                DeformationPoint.AssociatedPoints.Add(ModelDataObject.Points.Find(key => key.label == ModelDataObject.Frames[i].StartPoint));

                //Add dummy points on frame for deformation results
                DeformationPoint.FrameID = ModelDataObject.Frames[i].Label.ToString();
                DeformationPointsPos = DivideFrame(FrameStartPoint, FrameEndPoint);
                DeformationPointsPosCount = DeformationPointsPos.Count();

                for (j = 0; j < DeformationPointsPosCount; j++)
                {                    
                    ret = mySapModel.PointObj.AddCartesian(
                        DeformationPointsPos[j].X,
                        DeformationPointsPos[j].Y,
                        DeformationPointsPos[j].Z,
                        ref TempPointName,
                        ((ModelDataObject.Frames[i].Label * 1000000) + j).ToString(),
                        "Global");
                    PointsNamesTest.Add(TempPointName);
                    DeformationPoint.AssociatedPoints.Add(
                        new Point()
                        {
                            label = (ModelDataObject.Frames[i].Label * 1000000) + j,
                            position = new double[] { 
                                DeformationPointsPos[j].X,
                                DeformationPointsPos[j].Y,
                                DeformationPointsPos[j].Z },
                            Restraints = new bool[] {
                                false,
                                false,
                                false,
                                false,
                                false,
                                false
                            }
                        });
                }
                //add frame first point
                DeformationPoint.AssociatedPoints.Add(ModelDataObject.Points.Find(key => key.label == ModelDataObject.Frames[i].EndPoint));
                DeformationPoints_.Add(DeformationPoint);

                //refresh view, update (initialize) zoom
                ret = mySapModel.View.RefreshView(0, false);
            }

            #endregion

            #endregion

            //save model
            ret = mySapModel.File.Save(ModelPath);
            
            //run model (this will create the analysis model)
            ret = mySapModel.Analyze.RunAnalysis();

            #region Get SAP Results

            //object contains all model results
            SapResults ModelResults = new SapResults();

            #region Get Frame Straining Actions

            //set place holders for frame straining actions results
            int NumberofResults = 0;
            string[] ObjectName = null;
            double[] ObjectStations = null;
            string[] ELmName = null;
            double[] ElmStations = null;
            string[] LoadCases = null;
            string[] StepType_ = null;
            double[] StepNum_ = null;
            double[] p = null;
            double[] v2 = null;
            double[] v3 = null;
            double[] t = null;
            double[] m2 = null;
            double[] m3 = null;
            bool selected = true;

            //Loop through each Load comb
            for (i = 0; i < LoadCombinationCount; i++)
            {
                ret = mySapModel.Results.Setup.DeselectAllCasesAndCombosForOutput();
                ret = mySapModel.Results.Setup.SetComboSelectedForOutput(
                    ModelDataObject.Combinations[i].CombinationID,
                    selected);

                //Loop through each frame
                for (j = 0; j < FramesCount; j++)
                {
                    //get frame straining actions results       
                    ret = mySapModel.Results.FrameForce(
                        ModelDataObject.Frames[j].Label.ToString(),
                        eItemTypeElm.ObjectElm,
                        ref NumberofResults,
                        ref ObjectName,
                        ref ObjectStations,
                        ref ELmName,
                        ref ElmStations,
                        ref LoadCases,
                        ref StepType_,
                        ref StepNum_,
                        ref p,
                        ref v2,
                        ref v3,
                        ref t,
                        ref m2,
                        ref m3);

                    //map the filled array to the ModellResults object
                    ModelResults.StrainingActions.Add(
                        new SapStrainingActions()
                        {
                            FrameID = ModelDataObject.Frames[j].Label.ToString(),
                            PatternID = ModelDataObject.Combinations[i].CombinationID,
                            StartPoint = ModelDataObject.Points.Find(key => key.label == ModelDataObject.Frames[j].StartPoint).position,
                            EndPoint = ModelDataObject.Points.Find(key => key.label == ModelDataObject.Frames[j].EndPoint).position,
                            Stations = ObjectStations,
                            MomentX = m3,
                            MomentY = m2,
                            Torsion = t,
                            Normal = p,
                            ShearX = v2,
                            ShearY = v3,
                            Rotation = ModelDataObject.Frames[j].Rotation
                        });
                }
            }
            //Loop through each Load case
            for (i = 0; i < LoadPatternCount; i++)
            {
                ret = mySapModel.Results.Setup.DeselectAllCasesAndCombosForOutput();
                ret = mySapModel.Results.Setup.SetCaseSelectedForOutput(
                    ModelDataObject.Patterns[i].PatternID,
                    selected);

                //Loop through each frame
                for (j = 0; j < FramesCount; j++)
                {
                    //get frame straining actions results       
                    ret = mySapModel.Results.FrameForce(
                        ModelDataObject.Frames[j].Label.ToString(),
                        eItemTypeElm.ObjectElm,
                        ref NumberofResults,
                        ref ObjectName,
                        ref ObjectStations,
                        ref ELmName,
                        ref ElmStations,
                        ref LoadCases,
                        ref StepType_,
                        ref StepNum_,
                        ref p,
                        ref v2,
                        ref v3,
                        ref t,
                        ref m2,
                        ref m3);

                    //map the filled array to the ModellResults object
                    ModelResults.StrainingActions.Add(
                        new SapStrainingActions()
                        {
                            FrameID = ModelDataObject.Frames[j].Label.ToString(),
                            PatternID = ModelDataObject.Patterns[i].PatternID,
                            StartPoint = ModelDataObject.Points.Find(key => key.label == ModelDataObject.Frames[j].StartPoint).position,
                            EndPoint = ModelDataObject.Points.Find(key => key.label == ModelDataObject.Frames[j].EndPoint).position,
                            Stations = ObjectStations,
                            MomentX = m3,
                            MomentY = m2,
                            Torsion = t,
                            Normal = p,
                            ShearX = v2,
                            ShearY = v3,
                            Rotation = ModelDataObject.Frames[j].Rotation
                        });
                }
            }

            #endregion

            #region Get Frame Deformations

            //Deformation Points count
            int DeformationFramesCount = DeformationPoints_.Count();
            int DeformationPointsCount;
            int DefNumberofResults = 0;
            SapDeformationDetails PointDeformationDetails;
            SapDeformationFrame FrameDeformationDetails;
            SapDeformation Deformation;

            //set place holders for frame straining actions results
            string[] DefObject = null;
            string[] DefELm = null;
            string[] DefLoadCases = null;
            string[] DefStepType_ = null;
            double[] DefStepNum_ = null;
            double[] U1 = null;
            double[] U2 = null;
            double[] U3 = null;
            double[] R1 = null;
            double[] R2 = null;
            double[] R3 = null;

            //Loop through each Frame
            for (i = 0; i < DeformationFramesCount; i++)
            {
                Deformation = new SapDeformation();                             //create new frame deformation data instance
                Deformation.FrameID = DeformationPoints_[i].FrameID;
                //loop through each comb                
                for (j = 0; j < LoadCombinationCount; j++)
                {
                    ret = mySapModel.Results.Setup.DeselectAllCasesAndCombosForOutput();
                    ret = mySapModel.Results.Setup.SetComboSelectedForOutput(
                        ModelDataObject.Combinations[j].CombinationID,
                        selected);

                    FrameDeformationDetails = new SapDeformationFrame();                    //create new combo data instance
                    FrameDeformationDetails.caseID = ModelDataObject.Combinations[j].CombinationID;
                    DeformationPointsCount = DeformationPoints_[i].AssociatedPoints.Count();
                    //Loop through each deformation point
                    for (k = 0; k < DeformationPointsCount; k++)
                    {
                        PointDeformationDetails = new SapDeformationDetails();
                        ret = mySapModel.Results.JointDispl(
                            DeformationPoints_[i].AssociatedPoints[k].label.ToString(),
                            eItemTypeElm.ObjectElm,
                            ref DefNumberofResults,
                            ref DefObject,
                            ref DefELm,
                            ref DefLoadCases,
                            ref DefStepType_,
                            ref DefStepNum_,
                            ref U1,
                            ref U2,
                            ref U3,
                            ref R1,
                            ref R2,
                            ref R3);
                        //add point position to results object
                        PointDeformationDetails.Stations.Add(
                            new DummyPoint()
                            {
                                X = DeformationPoints_[i].AssociatedPoints[k].position[0],
                                Y = DeformationPoints_[i].AssociatedPoints[k].position[1],
                                Z = DeformationPoints_[i].AssociatedPoints[k].position[2]
                            });
                        //assign Deformation Data
                        PointDeformationDetails.U1 = U1;
                        PointDeformationDetails.U2 = U2;
                        PointDeformationDetails.U3 = U3;
                        PointDeformationDetails.R1 = R1;
                        PointDeformationDetails.R2 = R2;
                        PointDeformationDetails.R3 = R3;

                        //add to frame deformation list
                        FrameDeformationDetails.PointsDeformationDetails.Add(PointDeformationDetails);

                        DefObject = null;
                        DefELm = null;
                        DefLoadCases = null;
                        DefStepType_ = null;
                        DefStepNum_ = null;
                        U1 = null;
                        U2 = null;
                        U3 = null;
                        R1 = null;
                        R2 = null;
                        R3 = null;
                    }
                    //add to case list
                    Deformation.DeformationDetails.Add(FrameDeformationDetails);
                }
                //loop through each pattern
                for (j = 0; j < LoadPatternCount; j++)
                {
                    ret = mySapModel.Results.Setup.DeselectAllCasesAndCombosForOutput();
                    ret = mySapModel.Results.Setup.SetCaseSelectedForOutput(
                        ModelDataObject.Patterns[j].PatternID,
                        selected);

                    FrameDeformationDetails = new SapDeformationFrame();
                    FrameDeformationDetails.caseID = ModelDataObject.Patterns[j].PatternID;
                    DeformationPointsCount = DeformationPoints_[i].AssociatedPoints.Count();
                    //Loop through each deformation point
                    for (k = 0; k < DeformationPointsCount; k++)
                    {
                        PointDeformationDetails = new SapDeformationDetails();
                        ret = mySapModel.Results.JointDispl(
                            DeformationPoints_[i].AssociatedPoints[k].label.ToString(),
                            eItemTypeElm.ObjectElm,
                            ref DefNumberofResults,
                            ref DefObject,
                            ref DefELm,
                            ref DefLoadCases,
                            ref DefStepType_,
                            ref DefStepNum_,
                            ref U1,
                            ref U2,
                            ref U3,
                            ref R1,
                            ref R2,
                            ref R3);
                        //add point position to results object
                        PointDeformationDetails.Stations.Add(
                            new DummyPoint()
                            {
                                X = DeformationPoints_[i].AssociatedPoints[k].position[0],
                                Y = DeformationPoints_[i].AssociatedPoints[k].position[1],
                                Z = DeformationPoints_[i].AssociatedPoints[k].position[2]
                            });
                        //assign Deformation Data
                        PointDeformationDetails.U1 = U1;
                        PointDeformationDetails.U2 = U2;
                        PointDeformationDetails.U3 = U3;
                        PointDeformationDetails.R1 = R1;
                        PointDeformationDetails.R2 = R2;
                        PointDeformationDetails.R3 = R3;

                        //add to frame deformation list
                        FrameDeformationDetails.PointsDeformationDetails.Add(PointDeformationDetails);

                        DefObject = null;
                        DefELm = null;
                        DefLoadCases = null;
                        DefStepType_ = null;
                        DefStepNum_ = null;
                        U1 = null;
                        U2 = null;
                        U3 = null;
                        R1 = null;
                        R2 = null;
                        R3 = null;
                    }
                    //add to case list
                    Deformation.DeformationDetails.Add(FrameDeformationDetails);
                }
                ModelResults.Deformations.Add(Deformation);
            }

            #endregion

            #region Get Base Reactions

            int BaseNumberofResults = 0;
            string[] BaseObj = null;
            string[] BaseElm = null;
            string[] BaseLoadCases = null;
            string[] BaseStepType_ = null;
            double[] BaseStepNum_ = null;
            double[] F1 = null;
            double[] F2 = null;
            double[] F3 = null;
            double[] M1 = null;
            double[] M2 = null;
            double[] M3 = null;

            //Loop through each Load comb
            for (i = 0; i < LoadCombinationCount; i++)
            {
                ret = mySapModel.Results.Setup.DeselectAllCasesAndCombosForOutput();
                ret = mySapModel.Results.Setup.SetComboSelectedForOutput(
                    ModelDataObject.Combinations[i].CombinationID,
                    selected);

                //Loop through each frame
                for (j = 0; j < PointsCount; j++)
                {
                    //loop at each restraint to check if this is a support point
                    for (k = 0; k < 6; k++)
                    {
                        if (ModelDataObject.Points[j].Restraints[k] == true)
                        {
                            ret = mySapModel.Results.JointReact(
                                ModelDataObject.Points[j].label.ToString(),
                                eItemTypeElm.ObjectElm,
                                ref BaseNumberofResults,
                                ref BaseElm,
                                ref BaseObj,
                                ref BaseLoadCases,
                                ref BaseStepType_,
                                ref BaseStepNum_,
                                ref F1,
                                ref F2,
                                ref F3,
                                ref M1,
                                ref M2,
                                ref M3);

                            //map the filled array to the ModellResults object
                            ModelResults.Reactions.Add(
                                new SapReactions()
                                {
                                    JointID = ModelDataObject.Points[j].label.ToString(),
                                    PatternID = ModelDataObject.Combinations[i].CombinationID,
                                    Position = ModelDataObject.Points[j].position,
                                    Rx = F1,
                                    Ry = F2,
                                    Rz = F3,
                                    Mx = M1,
                                    My = M2,
                                    Mz = M3
                                });

                            break;
                        }
                    }
                }
            }
            //Loop through each Load case
            for (i = 0; i < LoadPatternCount; i++)
            {
                ret = mySapModel.Results.Setup.DeselectAllCasesAndCombosForOutput();
                ret = mySapModel.Results.Setup.SetCaseSelectedForOutput(
                    ModelDataObject.Patterns[i].PatternID,
                    selected);

                //Loop through each frame
                for (j = 0; j < PointsCount; j++)
                {
                    //loop at each restraint to check if this is a support point
                    for (k = 0; k < 6; k++)
                    {
                        if (ModelDataObject.Points[j].Restraints[k] == true)
                        {
                            ret = mySapModel.Results.JointReact(
                                ModelDataObject.Points[j].label.ToString(),
                                eItemTypeElm.ObjectElm,
                                ref BaseNumberofResults,
                                ref BaseElm,
                                ref BaseObj,
                                ref BaseLoadCases,
                                ref BaseStepType_,
                                ref BaseStepNum_,
                                ref F1,
                                ref F2,
                                ref F3,
                                ref M1,
                                ref M2,
                                ref M3);

                            //map the filled array to the ModellResults object
                            ModelResults.Reactions.Add(
                                new SapReactions()
                                {
                                    JointID = ModelDataObject.Points[j].label.ToString(),
                                    PatternID = ModelDataObject.Patterns[i].PatternID,
                                    Position = ModelDataObject.Points[j].position,
                                    Rx = F1,
                                    Ry = F2,
                                    Rz = F3,
                                    Mx = M1,
                                    My = M2,
                                    Mz = M3
                                });

                            break;
                        }
                    }
                }
            }

            #endregion

            #endregion

            return ModelResults;
        }

        public static List<DummyPoint> DivideFrame(double[] StartPoint, double[] EndPoint)
        {
            List<DummyPoint> DividedPoints = new List<DummyPoint>();
            double dx = EndPoint[0] - StartPoint[0];
            double dy = EndPoint[1] - StartPoint[1];
            double dz = EndPoint[2] - StartPoint[2];
            double x, y, z;
            int NumberofPoints = (int)Math.Round(GetFrameLength(StartPoint, EndPoint));

            if (NumberofPoints > 10)
            {
                NumberofPoints = 10;
            }
            else if (NumberofPoints < 5)
            {
                NumberofPoints = 5;
            }

            for (int i = 1; i < NumberofPoints; i++)
            {
                x = StartPoint[0] + ((i * dx) / NumberofPoints);
                y = StartPoint[1] + ((i * dy) / NumberofPoints);
                z = StartPoint[2] + ((i * dz) / NumberofPoints);
                DividedPoints.Add(new DummyPoint() { X = x, Y = y, Z = z });
            }
            return DividedPoints;
        }

        public static double GetFrameLength(double[] StartPoint, double[] EndPoint)
        {
            double x = EndPoint[0] - StartPoint[0];
            double y = EndPoint[1] - StartPoint[1];
            double z = EndPoint[2] - StartPoint[2];
            return Math.Sqrt((x * x) + (y * y) + (z * z));
        }

        #endregion
    }
}
