import * as crypto from 'crypto';
import * as cuid from 'cuid'; // move it out if you want to share, note that this is a tool.
import * as ipRegex from 'ip-regex';
import sanitizeHtml from 'sanitize-html';
import buildMakeComment from './comment.entity';
import buildMakeSource from './source.entity';

// this is an adapter to port (2 methods)
const Id = Object.freeze({
    makeId: cuid,
    isValidId: cuid.isCuid,
});

// this is an adapter to port (1 method)
function isValidIp(ip) {
    return ipRegex({ exact: true }).test(ip);
}

function md5(text) {
    return crypto
        .createHash('md5')
        .update(text, 'utf-8' as crypto.Utf8AsciiLatin1Encoding)
        .digest('hex');
}

function sanitize(text) {
    // TODO: allow more coding embeds
    return sanitizeHtml(text, {
        allowedIframeHostnames: ['codesandbox.io', 'repl.it'],
    });
}

const makeSource = buildMakeSource({ isValidIp });
// comment is an aggregated domain entity (source)
const makeComment = buildMakeComment({ Id, md5, sanitize, makeSource });

export default makeComment;
