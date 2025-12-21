import urllib.request
import json
import os

API_KEY = "7d8ac02595e817953c9fb295606c4e08"
URL = f"https://api.themoviedb.org/3/trending/movie/week?api_key={API_KEY}&language=tr-TR"

try:
    with urllib.request.urlopen(URL) as response:
        if response.status == 200:
            data = json.loads(response.read().decode())
            results = data.get("results", [])
            print(f"SUCCESS: Found {len(results)} movies.")
            if len(results) > 0:
                print(f"First movie: {results[0]['title']}")
        else:
            print(f"ERROR: Status {response.status}")
except Exception as e:
    print(f"EXCEPTION: {e}")
