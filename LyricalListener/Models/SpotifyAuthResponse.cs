using SpotifyAPI.Web;

namespace LyricalListener.Models
{
    public class SpotifyAuthResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public int ExpiresIn { get; set; }

        public static SpotifyAuthResponse From(AuthorizationCodeTokenResponse authCodeResponse)
        {
            return new()
            {
                AccessToken = authCodeResponse.AccessToken,
                RefreshToken = authCodeResponse.RefreshToken,
                ExpiresIn = authCodeResponse.ExpiresIn
            };
        }

        public static SpotifyAuthResponse From(AuthorizationCodeRefreshResponse authCodeResponse)
        {
            return new()
            {
                AccessToken = authCodeResponse.AccessToken,
                ExpiresIn = authCodeResponse.ExpiresIn
            };
        }
    }
}