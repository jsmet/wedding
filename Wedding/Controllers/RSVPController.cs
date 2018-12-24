
using Microsoft.AspNetCore.Mvc;
using Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Wedding.Models;

namespace Wedding.Controllers
{
    [Route("api/[controller]")]
    public class RSVPController : Controller
    {

        private IRsvpService _repo;
        private static Dictionary<string, int> _clientRequests = null;
        private static readonly object instanceLock = new object();

        public RSVPController(Services.IRsvpService repo)
        {
            _repo = repo;
            if (_clientRequests == null)
            {
                lock (instanceLock)
                {
                    _clientRequests = new Dictionary<string, int>();
                }
            }
        }

        [Produces("application/json")]
        [HttpGet]
        public async Task<IActionResult> Get(int id)
        {
            // First time they're hitting the end point, add them to the request clients but don't delay. 
            if (!_clientRequests.ContainsKey(Request.HttpContext.Connection.RemoteIpAddress.ToString()))
            {
                _clientRequests.Add(Request.HttpContext.Connection.RemoteIpAddress.ToString(), 1);
            }
            // They've hit this before so time to start throttling
            else
            {
                await Task.Delay(_clientRequests[Request.HttpContext.Connection.RemoteIpAddress.ToString()] * 1000);
            }

            var result = await _repo.GetRsvp(id);

            // Successfully pulled up an RSVP, remove them from tracked clients. 
            if (result != null)
            {
                _clientRequests.Remove(Request.HttpContext.Connection.RemoteIpAddress.ToString());
                return Ok(result);
            }
            // They failed, time to start increasing the throttle
            else
            {
                _clientRequests[Request.HttpContext.Connection.RemoteIpAddress.ToString()] = _clientRequests[Request.HttpContext.Connection.RemoteIpAddress.ToString()] * 2;
                return BadRequest();
            }
        }

        [Produces("application/json")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ConfirmRsvp request)
        {
            var result = await _repo.ConfirmRsvp(request);

            return Ok();
        }
    }
}
