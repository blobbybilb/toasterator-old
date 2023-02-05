require "kemal"

header = %(<head>
<title>toasterator</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="/style.css" />
</head>
)

blockmc = true

spawn do
  loop do
    if blockmc
      Process.run("killall", ["java"])
      sleep 5.seconds
    else
      sleep 5.seconds
    end
  end
end

get "/" do
  render "views/main.ecr"
end

get "/shutdown" do
  Process.run("shutdown", ["now"])
  "Done"
end

get "/exitmc" do
  Process.run("killall", ["java"])
  "Done"
end

get "/logout" do
  Process.run("pkill", ["-u", "ronan"])
  "Done"
end

get "/reboot" do
  Process.run("reboot")
  "Done"
end

get "/blockmc" do
  blockmc = true
  next "Done"
end

get "/unblockmc" do
  blockmc = false
  "Done"
end

Kemal.config.env = "production"
Kemal.config.port = 6011
Kemal.run
