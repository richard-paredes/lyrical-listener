using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using AngleSharp;
using LyricalListener.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SpotifyAPI.Web;
using IConfiguration = Microsoft.Extensions.Configuration.IConfiguration;

namespace LyricalListener.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class SpotifyController : Controller
    {
        private static readonly IOAuthClient OAuthClient = new OAuthClient();
        private readonly IConfiguration _configuration;
        private readonly ILogger<SpotifyController> _logger;

        public SpotifyController(ILogger<SpotifyController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("auth")]
        public async Task<IActionResult> GetSpotifyAuthResponse([FromBody] string authorizationCode)
        {
            try
            {
                var redirectUriString = Request.Scheme + "://" + Request.Host.Host;
                if (_configuration["ASPNETCORE_ENVIRONMENT"] == "Development" || Request.Host.Host == "localhost")
                    redirectUriString += ":" + Request.Host.Port;
                
                var request = new AuthorizationCodeTokenRequest(_configuration["SpotifyClientId"],
                    _configuration["SpotifyClientSecret"], authorizationCode, new Uri(redirectUriString));
                var response = await OAuthClient.RequestToken(request);
                
                return Ok(SpotifyAuthResponse.From(response));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        [HttpPost]
        [Route("auth/refresh")]
        public async Task<IActionResult> RefreshSpotifyAccess([FromBody] string refreshToken)
        {
            try
            {
                var request = new AuthorizationCodeRefreshRequest(_configuration["SpotifyClientId"],
                    _configuration["SpotifyClientSecret"], refreshToken);
                var response = await new OAuthClient().RequestToken(request);
                
                return Ok(SpotifyAuthResponse.From(response));
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }

        [Route("lyrics")]
        public async Task<IActionResult> ReturnTrackLyrics(string trackTitle, string artist)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(trackTitle) || string.IsNullOrWhiteSpace(artist)) return BadRequest();

                trackTitle = Regex.Replace(trackTitle, @"\([^)]*\)", string.Empty);
                artist = Regex.Replace(artist, @"\([^)]*\)", string.Empty);
                
                var trackQuery = string.Join("+", trackTitle.Split().Select(HttpUtility.UrlEncode));
                var artistQuery = string.Join("+", artist.Split().Select(HttpUtility.UrlEncode));
                var queryUrl = $"https://google.com/search?q={trackQuery}+by+{artistQuery}+lyrics";
                
                var config = Configuration.Default.WithDefaultLoader();
                var context = BrowsingContext.New(config);
                var document = await context.OpenAsync(queryUrl);
                var lyricsWithCredits = document.QuerySelector("div#main").Children.Skip(3).Take(1).Single().FirstElementChild.Children.Skip(2).Take(1).Single().TextContent;
                
                var sourceIdx = lyricsWithCredits.IndexOf("Source:", StringComparison.Ordinal);
                if (sourceIdx == -1)
                {
                    return Ok();
                }
                
                var lyrics = lyricsWithCredits[..sourceIdx].Replace("\n", "<br>");
                var source = lyricsWithCredits[sourceIdx..].Replace("\n", "<br>");
                return Ok(lyrics + "<br><br>" + "<strong>" + source + "<strong>");
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }
        }
    }
}