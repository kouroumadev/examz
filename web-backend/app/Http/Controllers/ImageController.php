<?php

namespace App\Http\Controllers;

<<<<<<< HEAD
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
=======
use App\Http\Requests\FileUploadRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use function GuzzleHttp\Promise\all;
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e

class ImageController extends Controller
{
    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'file' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        if ($request->hasFile('file')) {
            $image = rand() . '.' . $request->file->getClientOriginalExtension();
            Storage::putFileAs('public/images', $request->file('file'), $image);
        }

        $data = compact('image');

        return $this->responseSuccess('Image successfully uploaded', $data, 200);
    }
<<<<<<< HEAD
=======

    public function imageUploadLink(FileUploadRequest $request)
    {
        $s3 = Storage::disk('s3');
        $client = $s3->getDriver()->getAdapter()->getClient();
        $bucket = $this->bucketName($request);
        $file_path = $this->filePath($request);
        $region = Config::get("filesystems.disks.s3.region");
        $cmd = $client->getCommand('PutObject', [
            'Bucket' => $bucket,
            'Key' => $file_path,
            'ACL' => $this->acl($request),
            'Metadata' => $this->metadata($request),
        ]);
        $response = $client->createPresignedRequest($cmd, $this->linkExpiry($request));
        $upload_link = (string)$response->getUri();
        $file_link = sprintf("https://%s.s3.%s.amazonaws.com/%s", $bucket, $region, $file_path);
        return response()->json(['upload_link' => $upload_link, 'file_link' => $file_link], 201);
    }

    private function linkExpiry(FileUploadRequest $request)
    {
        return "+10 minutes";
    }

    private function acl(FileUploadRequest $request)
    {
        return "public-read";
    }

    private function metadata(FileUploadRequest $request)
    {
        // $options = ['user-data' => 'user-meta-value'];
        return [];
    }

    private function bucketName(FileUploadRequest $request)
    {
        $prefix = "filesystems.disks.s3.";
        $type = $request->input("type");
        $sub_type = $request->input("sub_type");
        if ($type == "QUESTION_ANSWER") {
            if ($sub_type == "QUESTION") {
                return Config::get($prefix . "question_bucket");
            }
            if ($sub_type == "ANSWER") {
                return Config::get($prefix . "answer_bucket");
            }
            return Config::get($prefix . "question_answer_bucket");
        }
        if ($type == "ANNOUNCEMENT") {
            return Config::get($prefix . "announcement_bucket");
        }
        if ($type == "BLOG") {
            return Config::get($prefix . "blog_bucket");
        }
        return Config::get($prefix . "bucket");
    }

    private function filePath(FileUploadRequest $request)
    {
        $extensions = explode(".", $request->input("name"));
        $extension = $extensions[count($extensions) - 1];
        $file_name = join("_", array_slice($extensions, 0, count($extensions) - 1));
        $file_name = Str::slug($file_name);
        $prefix = Str::random();
        return $prefix . "-" . $file_name . "." . $extension;
    }
>>>>>>> 0d0a9d575126560680f8bb2e76de334ac45dd27e
}
