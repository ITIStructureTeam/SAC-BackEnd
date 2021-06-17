using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    public class Load
    {
        public string Pattern { get; set; }
        public List<LoadDetail> LoadDetails { get; set; }
    }   
}
