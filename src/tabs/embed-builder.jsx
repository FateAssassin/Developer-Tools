import { useState, useContext, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AlertContext } from "../context/AlertContext";
import AnimatedDetails from "../embed-builder/Details";

export default function EmbedBuilder() {
  const { showAlert } = useContext(AlertContext);
  const [message, setMessage] = useState("Message");
  const [title, setTitle] = useState("Embed Title");
  const [author, setAuthor] = useState("");
  const [authorURL, setAuthorURL] = useState("");
  const [authorIcon, setAuthorIcon] = useState("");
  const [titleURL, setTitleURL] = useState("");
  const [description, setDescription] = useState("Description");
  const [color, setColor] = useState("#5865F2");
  const [fields, setFields] = useState([]);
  const [fieldTitle, setFieldTitle] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [footer, setFooter] = useState("");
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [copyHex, setCopyHex] = useState(false);
  const [tab, setTab] = useState("preview");
  const [copyCode, setCopyCode] = useState(false);
  const [webhookURL, setWebhookURL] = useState("");
  const [sending, setSending] = useState(false);

  const addField = () => {
    if (fieldTitle && fieldValue) {
      setFields([
        ...fields,
        { name: fieldTitle, value: fieldValue },
      ]);
      setFieldTitle("");
      setFieldValue("");
    } else {
      showAlert("Please provide both field name and value.", "error");
    }
  };
  function parseDiscordBold(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
  function parseDiscordItalics(text) {
    return text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
  function parseDiscordUnderline(text) {
    return text.replace(/__(.*?)__/g, '<u>$1</u>');
  }
  const handleCopyHex = () => {
    navigator.clipboard.writeText(color);setCopyHex(true);setTimeout(() => setCopyHex(false), 2000);
  }
  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);setCopyCode(true);setTimeout(() => setCopyCode(false), 2000);
  }
  const handleSendWebhook = async () => {
    if (!webhookURL) return showAlert("Please enter a webhook URL.", "error");
    setSending(true);
    if (image && !image.endsWith(".png") && !image.endsWith(".jpg") && !image.endsWith(".jpeg") && !image.endsWith(".gif")) { showAlert("Invalid image URL. Please provide a valid image URL.", "error"); setSending(false); return setImage(""); }
    if (thumbnail && !thumbnail.endsWith(".png") && !thumbnail.endsWith(".jpg") && !thumbnail.endsWith(".jpeg") && !thumbnail.endsWith(".gif")) { showAlert("Invalid thumbnail URL. Please provide a valid thumbnail URL.", "error"); setSending(false); return setThumbnail(""); }
    if (authorIcon && !authorIcon.endsWith(".png") && !authorIcon.endsWith(".jpg") && !authorIcon.endsWith(".jpeg") && !authorIcon.endsWith(".gif")) { showAlert("Invalid author icon URL. Please provide a valid author icon URL.", "error"); setSending(false); return setAuthorIcon(""); }
    if (fields.length > 25) {
      setSending(false);
      return showAlert("You can only have up to 25 fields in an embed.", "error");
    }
    const payload = {
      content: message || undefined,
      embeds: [
        {
          title: title || undefined,
          description: description || undefined,
          color: parseInt(color.replace("#", ""), 16),
          fields: fields.length > 0 ? fields : undefined,
          footer: footer ? { text: footer } : undefined,
          image: image ? { url: image } : undefined,
          thumbnail: thumbnail ? { url: thumbnail } : undefined,
          author: author
            ? {
                name: author,
                ...(authorURL ? { url: authorURL } : {}),
                ...(authorIcon ? { icon_url: authorIcon } : {}),
              }
            : undefined,
          url: titleURL || undefined,
        },
      ],
    };
    console.log("Sending payload:", payload);
    try {
      const response = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        showAlert("Embed sent successfully!", "success");
      } else {
        showAlert("Failed to send embed. Please check the webhook URL.", "error");
      }
    } catch (error) {
      showAlert("An error occurred while sending the embed.", "error");
      console.error("Error sending webhook:", error);
    } finally {
      setSending(false);
    }
  };

  const escape = (str) => str.replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "");

  const embedLines = [
    `embed = discord.Embed(`,
    `    title=${escape(title) ? '"' + escape(title) + '"' : "None"},`,
    `    description=${escape(description) ? '"' + escape(description) + '"' : "None"},`,
    `    color=${parseInt(color.replace("#", ""), 16)},`,
    `)`,
    ...fields.map(
      (f) =>
        `embed.add_field(name=${
          escape(f.name) ? '"' + escape(f.name) + '"' : "None"
        }, value=${
          escape(f.value) ? '"' + escape(f.value) + '"' : "None"
        })`
    ),
    footer ? `embed.set_footer(text="${escape(footer)}")` : "",
    image ? `embed.set_image(url="${escape(image)}")` : "",
    thumbnail ? `embed.set_thumbnail(url="${escape(thumbnail)}")` : "",
    author
      ? `embed.set_author(name="${escape(author)}"${
          authorURL ? `, url="${escape(authorURL)}"` : ""
        }${authorIcon ? `, icon_url="${escape(authorIcon)}"` : ""})`
      : "",
    titleURL ? `embed.url = "${escape(titleURL)}"` : "",
    `await ctx.send(${message ? `"${escape(message)}", ` : ""}embed=embed)`,
  ];

  const embedCode = embedLines.filter(Boolean).join("\n");

  return (
    <div>
    <div className="max-h-[90%] overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">
        Discord Embed Builder
      </h2>
      <p className="text-blue-500 dark:text-blue-300 mb-4">
        Create and customize Discord embeds with ease. Use the form below to generate the embed code you need for your bot.
      </p>

      {/* Message */}
      <div className="mb-1">
        <label className="block mb-1 font-medium dark:text-gray-200">Message (optional)</label>
        <textarea
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          style={{ resize: "vertical" }}
          placeholder="Message Content"
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {/* Title */}
      <div className="mb-4">
        <label className="block mb-1 font-medium dark:text-gray-200">Title</label>
        <input
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Embed Title"
          maxLength={256}
        />
      </div>

      <AnimatedDetails summary="Author-Options">
        {/* Author Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Author Name</label>
          <input
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author Name"
            maxLength={256}
          />
        </div>
        {/* Author URL */}
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Author URL</label>
          <input
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={authorURL}
            onChange={(e) => setAuthorURL(e.target.value)}
            placeholder="Author URL"
            maxLength={256}
          />
        </div>
        {/* Author Icon URL */}
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Author Icon URL</label>
          <input
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={authorIcon}
            onChange={(e) => setAuthorIcon(e.target.value)}
            placeholder="Author Icon URL"
            maxLength={256}
          />
        </div>
      </AnimatedDetails>
      
      {/* URL */}
      <div className="mb-4">
        <label className="block mb-1 font-medium dark:text-gray-200">URL</label>
        <input
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          value={url}
          onChange={(e) => setTitleURL(e.target.value)}
          placeholder="Embed URL"
          maxLength={256}
        />
      </div>
      {/* Description */}
      <div className="mb-4">
        <label className="block mb-1 font-medium dark:text-gray-200">Description</label>
        <textarea
          className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm overflow-x-hidden w-full resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Embed Description"
          maxLength={4096}
        />
      </div>

      {/* Footer */}
      <div className="mb-4">
        <label className="block mb-1 font-medium dark:text-gray-200">Footer</label>
        <input
          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          value={footer}
          onChange={(e) => setFooter(e.target.value)}
          placeholder="Embed Footer"
          maxLength={2048}
        />
      </div>

      {/* Color, Image, Thumbnail */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-5">
          {/* Color Picker */}
          <div>
            <label className="block mb-1 font-medium dark:text-gray-200">Color</label>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 border-2 border-gray-300 dark:border-gray-700 rounded cursor-pointer transition-shadow focus:outline-none"
                  style={{ padding: 0 }}
                />
                <span
                  title="Copy Hex-Code"
                  className={`px-2 py-1 cursor-pointer transition ${copyHex ? "bg-green-300 dark:bg-green-700" : "bg-gray-100 dark:bg-gray-800 font-mono"} rounded text-gray-800 dark:text-gray-200  border border-gray-200 dark:border-gray-700`}
                  onClick={handleCopyHex}
                >
                  {copyHex ? "Copied!" : color}
                </span>
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div className="min-w-[200px]">
            <label className="block mb-1 mt-[-14px] font-medium dark:text-gray-200">Image URL</label>
            <input
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Embed Image URL"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="min-w-[200px]">
            <label className="block mb-1 mt-[-14px] font-medium dark:text-gray-200">Thumbnail URL</label>
            <input
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Embed Thumbnail URL"
            />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2 dark:text-gray-100">Fields</h3>
        {fields.map((f, i) => (
          <div
            key={i}
            className="mb-1 text-sm bg-blue-200 dark:bg-gray-800 max-w-[50%] p-2 rounded flex justify-between items-center"
          >
            <p
              style={{
                wordBreak: "break-all",
                hyphens: "auto",
                overflowWrap: "break-word",
              }}
              className="dark:text-gray-100"
            >
              <strong>{f.name}</strong>: <br />
              {f.value}
            </p>
            <button
              className="bg-gray-100 dark:bg-gray-700 ml-4 px-2 py-1 border-2 border-red-700 text-red-700 font-extralight rounded-4xl cursor-pointer hover:bg-red-700 hover:text-white transition"
              onClick={() => setFields(fields.filter((_, index) => index !== i))}
            >
              <i className="bi bi-trash text-xl"></i>
            </button>
          </div>
        ))}
        {fields.length >= 2 && (
          <button
            className="bg-red-500 dark:bg-red-700 text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => setFields([])}
          >
            Clear all fields
          </button>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          <input
            className="border rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            value={fieldTitle}
            onChange={(e) => setFieldTitle(e.target.value)}
            placeholder="Field Name"
            maxLength={256}
          />
          <input
            className="border rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            placeholder="Field Value"
            maxLength={1024}
          />
          <button
            className="bg-blue-500 dark:bg-blue-700 text-white px-2 py-1 rounded cursor-pointer"
            onClick={addField}
            type="button"
          >
            Add Field
          </button>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-700" />
      <br />

      <div className="dark:bg-gray-800 bg-gray-300 rounded-sm px-2 py-4 ">
        {/* Tabs */}
        <div className="mb-2 flex border-b border-gray-400 dark:border-gray-700 pb-2">
          <a
            onClick={() => setTab("preview")}
            className={`cursor-pointer ${tab === "preview" ? "font-bold dark:text-gray-100" : "dark:text-gray-300"}`}
          >
            Preview
          </a>
          <a
            onClick={() => setTab("code")}
            className={`cursor-pointer ${tab === "code" ? "font-bold dark:text-gray-100" : "dark:text-gray-300"} ml-4`}
          >
            Code
          </a>
          <a
            onClick={() => setTab("webhook")}
            className={`cursor-pointer ${tab === "webhook" ? "font-bold dark:text-gray-100" : "dark:text-gray-300"} ml-4`}
          >
            Webhook
          </a>
        </div>

        {/* Preview Tab */}
        <div className={`${tab === "preview" ? "block" : "hidden"}`}>
          <div className="bg-[#36393e] p-4 rounded-sm mt-2">
            <div className="flex">
              <span className="bg-blue-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center">
                <i className="bi bi-person-fill"></i>
              </span>
              <div>
                <div className="mt-[-3px] ml-1">
                  <span className="text-gray-200 text-sm ml-1 font-bold">Discord Embed Builder</span>
                  <span className="bg-[#5865f2] text-white text-xs ml-1 px-1 rounded">BOT</span>
                  <span className="text-gray-400 text-sm mx-1">•</span>
                  <span className="text-gray-400 text-sm">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p
                className="text-white mb-2 whitespace-pre-line ml-2"
                style={{
                      wordBreak: "break-all",
                      hyphens: "auto",
                      overflowWrap: "break-word",
                }}
                dangerouslySetInnerHTML={{ __html: parseDiscordUnderline(parseDiscordItalics(parseDiscordBold(message))) }}
                />
              </div>
            </div>
            <div className="ml-10">
              <div
                className="p-4 bg-[#242429] max-w-[600px] border border-[#2c2e31] dark:border-gray-700 border-l-4 rounded text-white break-words flex"
                style={{ borderLeftColor: color }}
              >
                <div className="flex-1 relative flex flex-col">
                  {(author || authorIcon) && (
                    <div className="flex items-center mb-2">
                      {authorIcon && (
                        <img
                          src={authorIcon}
                          alt="Author Icon"
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      )}
                      {authorURL ? (
                        <a href={authorURL} target="_blank" rel="noopener noreferrer">
                          <strong className="text-blue-400 hover:underline">{author}</strong>
                        </a>
                      ) : (
                        <strong>{author}</strong>
                      )}
                    </div>
                  )}

                  <p
                    style={{
                      wordBreak: "break-all",
                      hyphens: "auto",
                      overflowWrap: "break-word",
                    }}
                  >
                    {titleURL ? (
                      <a href={titleURL} target="_blank" rel="noopener noreferrer">
                        <strong className="text-blue-400 hover:underline">{title}</strong>
                      </a>  
                    ) : (
                      <strong>{title}</strong>
                    )}
                  </p>
                  <p
                    className="font-light whitespace-pre-line"
                    style={{
                      wordBreak: "break-all",
                      hyphens: "auto",
                      overflowWrap: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: parseDiscordUnderline(parseDiscordItalics(parseDiscordBold(description))) }}
                  />
                  {fields.map((f, i) => (
                    <div
                      key={i}
                      className="mb-1"
                      style={{
                        wordBreak: "break-all",
                        hyphens: "auto",
                        overflowWrap: "break-word",
                      }}
                    >
                      <strong>{f.name}</strong> <br /> {f.value}
                    </div>
                  ))}
                  {image && (
                    <div className="mt-2">
                      <img
                        src={image}
                        alt="Embed"
                        className="max-w-xs max-h-48 rounded border border-gray-700"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  )}
                  <div className={`${footer ? "mt-5" : ""}`}></div>
                  <p
                    className="text-xs bottom-0 absolute text-gray-300"
                    style={{
                      wordBreak: "break-all",
                      hyphens: "auto",
                      overflowWrap: "break-word",
                    }}
                  >
                    {footer}
                  </p>
                </div>
                {thumbnail && (
                  <div className="mr-4 flex-shrink-0">
                    <img
                      src={thumbnail}
                      alt="Thumbnail"
                      className="w-28 h-28 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Tab */}
        <div className={`${tab === "code" ? "block" : "hidden"} relative`}>
          <SyntaxHighlighter
            language="python"
            className="overflow-x-scroll max-w-[90vw] [&::-webkit-scrollbar]:h-2 w-full [&::-webkit-scrollbar]:rounded-b-sm [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-gray-800"
            style={vscDarkPlus}
            customStyle={{
              borderRadius: "0.375rem",
              fontSize: "0.95rem",
              padding: "1rem",
              background: "#1e1e1e",
              overflowX: "scroll",
              wordBreak: "break-all",
              hyphens: "auto",
              overflowWrap: "break-word",
            }}
          >
            {embedCode}
          </SyntaxHighlighter>
          <button className={`ml-1 md:absolute bottom-[1rem] right-[1.5rem] ${copyCode ? "bg-green-900 dark:bg-green-700" : "cursor-pointer bg-gray-700 hover:bg-gray-600"}  text-white px-3 py-1 rounded text-sm transition-colors`} onClick={handleCopyCode}>
            <i className={`bi bi-${copyCode ? "check" : "copy"} mr-1`}></i>
          </button>
        </div>

        {/* Webhook Tab */}
        <div className={`${tab === "webhook" ? "block" : "hidden"}`}>
          <p className="text-blue-500 dark:text-blue-300">
            Send this embed via a webhook, simply provide the webhook URL and
            click send. 
          </p>
          <div>
            <input onChange={(e) => setWebhookURL(e.target.value)} type="text" className="border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-sm px-2 py-1 placeholder-gray-400 mt-2 w-1/2 dark:text-white" placeholder="Webhook URL" />
            <button className={`bg-blue-500 dark:bg-blue-700 text-white px-3 py-1 rounded ml-2 hover:bg-blue-600 dark:hover:bg-blue-600 transition cursor-pointer`} onClick={handleSendWebhook}>
              
              {sending ? "" : "Send"}
              <i className={`${sending ? 'animate-spin inline-block bi bi-arrow-clockwise' : ''}`}></i>
              
            </button>                             
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}