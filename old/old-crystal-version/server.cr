require "kemal"

# Config
toastlist = ["java", "osu!"]
user = "<user>"

header = %(
  <head>
  <title>toasterator</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
)

toasted = true
disabled = true

spawn do
  loop do
    if toasted
      Process.run("killall", toastlist)
    end
    if disabled
      Process.run("pkill", ["-u", user])
    end
    sleep 5.seconds
  end
end

get "/" do
  render "views/main.ecr"
end

get "/shutdown" do
  Process.run("shutdown", ["now"])
  message = "Shutdown Computer"
  render "views/done.ecr"
end

get "/exit" do
  Process.run("killall", ["java"])
  message = "Exit Toastlist"
  render "views/done.ecr"
end

get "/logout" do
  Process.run("pkill", ["-u", user])
  message = "Logout User"
  render "views/done.ecr"
end

get "/reboot" do
  Process.run("reboot")
  message = "Reboot Computer"
  render "views/done.ecr"
end

get "/toast" do
  toasted = true
  message = "Toast Toastlist"
  render "views/done.ecr"
end

get "/untoast" do
  toasted = false
  message = "Untoast Toastlist"
  render "views/done.ecr"
end

get "/add/:processname" do |env|
  params = env.params.url

  toastlist << params[:processname]
  message = "Add #{params[:processname]} to Toastlist"
  render "views/done.ecr"
end

get "/remove/:processname" do |env|
  params = env.params.url
  toastlist.delete(params[:processname])
  message = "Remov #{params[:processname]} from Toastlist"
  render "views/done.ecr"
end

get "/disable" do |env|
  params = env.params.url
  disabled = true
  message = "Disabled User #{user}"
  render "views/done.ecr"
end

get "/enable" do
  disabled = false
  message = "Enabled User #{user}"
  render "views/done.ecr"
end

Kemal.config.env = "production"
Kemal.config.port = 6010
Kemal.run
